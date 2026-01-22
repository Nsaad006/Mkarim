import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticate, authorize } from './auth';

const router = Router();

// GET /api/stats/summary - Public summary stats for homepage
router.get('/summary', async (req: Request, res: Response) => {
    try {
        const [totalProducts, totalCategories] = await Promise.all([
            prisma.product.count({ where: { inStock: true } }),
            prisma.category.count({ where: { active: true } })
        ]);

        res.json({
            totalProducts,
            totalCategories,
            deliveryTime: '24-72h',
            paymentMethods: ['COD', 'Carte bancaire']
        });
    } catch (error) {
        console.error('Error fetching summary stats:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

// GET /api/stats - Dashboard statistics (admin/editor/viewer)
router.get('/', authenticate, authorize(['super_admin', 'editor', 'viewer']), async (req: Request, res: Response) => {
    try {
        const [totalOrders, totalProducts, totalCategories, totalCities] = await Promise.all([
            prisma.order.count(),
            prisma.product.count(),
            prisma.category.count(),
            prisma.city.count()
        ]);

        const pendingOrders = await prisma.order.count({
            where: { status: 'PENDING' }
        });

        const confirmedOrders = await prisma.order.count({
            where: { status: 'CONFIRMED' }
        });

        const totalRevenue = await prisma.order.aggregate({
            _sum: {
                total: true
            },
            where: {
                status: {
                    in: ['CONFIRMED', 'SHIPPED', 'DELIVERED']
                }
            }
        });

        res.json({
            totalOrders,
            totalProducts,
            totalCategories,
            totalCities,
            pendingOrders,
            confirmedOrders,
            totalRevenue: totalRevenue._sum.total || 0
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

// GET /api/stats/analytics - Detailed analytics (admin/editor)
router.get('/analytics', authenticate, authorize(['super_admin', 'editor', 'viewer']), async (req: Request, res: Response) => {
    try {
        const { days = 30, from, to } = req.query;

        const getLocalDateString = (date: Date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        let startDate = new Date();
        startDate.setDate(startDate.getDate() - Number(days));

        if (from) startDate = new Date(from as string);
        let endDate = new Date();
        if (to) endDate = new Date(to as string);

        // Fetch orders in date range
        const orders = await prisma.order.findMany({
            where: {
                createdAt: {
                    gte: startDate,
                    lte: endDate
                },
                status: {
                    in: ['CONFIRMED', 'SHIPPED', 'DELIVERED']
                }
            },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                category: true
                            }
                        }
                    }
                }
            }
        });

        // 1. Revenue History
        const revenueMap = new Map<string, { revenue: number, orders: number }>();

        // Initialize map with all dates
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const dateStr = getLocalDateString(d);
            revenueMap.set(dateStr, { revenue: 0, orders: 0 });
        }

        orders.forEach(order => {
            const dateStr = getLocalDateString(new Date(order.createdAt));
            const current = revenueMap.get(dateStr) || { revenue: 0, orders: 0 };
            revenueMap.set(dateStr, {
                revenue: current.revenue + order.total,
                orders: current.orders + 1
            });
        });

        const revenueHistory = Array.from(revenueMap.entries())
            .map(([date, data]) => ({
                date: new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
                fullDate: date,
                revenue: data.revenue,
                orders: data.orders
            }))
            .sort((a, b) => a.fullDate.localeCompare(b.fullDate));

        // 2. Sales by City
        const cityMap = new Map<string, number>();
        orders.forEach(order => {
            const city = order.city || 'Inconnu';
            cityMap.set(city, (cityMap.get(city) || 0) + 1);
        });

        const salesByCity = Array.from(cityMap.entries())
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);

        // 3. Top Products
        const productMap = new Map<string, {
            id: string,
            name: string,
            image: string,
            category: string,
            sales: number,
            revenue: number
        }>();

        orders.forEach(order => {
            order.items.forEach(item => {
                if (!item.product) return;

                const existing = productMap.get(item.productId) || {
                    id: item.productId,
                    name: item.product.name,
                    image: item.product.image,
                    category: item.product.category?.name || 'Sans catégorie',
                    sales: 0,
                    revenue: 0
                };

                productMap.set(item.productId, {
                    ...existing,
                    sales: existing.sales + item.quantity,
                    revenue: existing.revenue + (item.price * item.quantity)
                });
            });
        });

        const topProducts = Array.from(productMap.values())
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10);

        // 4. Low Stock
        const lowStock = await prisma.product.findMany({
            where: {
                quantity: {
                    lte: 5
                },
                inStock: true
            },
            include: {
                category: true
            },
            take: 10
        });

        // 5. Out of Stock (products marked as not in stock)
        const outOfStock = await prisma.product.findMany({
            where: {
                inStock: false
            },
            include: {
                category: true
            },
            take: 10
        });

        // 5. General Stats (Totals)
        const [totalRevenue, totalOrders, pendingOrders, deliveredOrders, totalProducts, totalCustomers, totalCities] = await Promise.all([
            prisma.order.aggregate({
                _sum: { total: true },
                where: {
                    status: {
                        in: ['CONFIRMED', 'SHIPPED', 'DELIVERED']
                    }
                }
            }),
            prisma.order.count(),
            prisma.order.count({ where: { status: 'PENDING' } }),
            prisma.order.count({ where: { status: 'DELIVERED' } }),
            prisma.product.count(),
            prisma.order.groupBy({ by: ['phone'] }).then(res => res.length), // Approx unique customers
            prisma.city.count()
        ]);

        res.json({
            revenueHistory,
            salesByCity,
            topProducts,
            lowStock: lowStock.map(p => ({ ...p, status: p.quantity === 0 ? 'OUT_OF_STOCK' : 'LOW_STOCK' })),
            outOfStock,
            stats: {
                totalRevenue: totalRevenue._sum.total || 0,
                totalOrders,
                pendingOrders,
                deliveredOrders,
                totalProducts,
                totalCustomers,
                totalCities
            }
        });

    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

export default router;
