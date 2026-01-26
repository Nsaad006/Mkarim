import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticate, authorize } from './auth';

const router = Router();

// GET /api/customers - Get all unique customers from orders
router.get('/', authenticate, authorize(['super_admin', 'editor', 'viewer']), async (req: Request, res: Response) => {
    try {
        // Fetch all orders with their items
        const orders = await prisma.order.findMany({
            include: {
                items: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Group orders by customer (using phone as unique identifier)
        const customersMap = new Map<string, {
            name: string;
            phone: string;
            email: string;  // Added email
            city: string;
            address: string;
            totalOrders: number;
            totalSpent: number;
            lastOrderDate: Date;
            orders: string[];
        }>();

        orders.forEach(order => {
            const existing = customersMap.get(order.phone);

            if (existing) {
                // Update existing customer
                existing.totalOrders += 1;
                existing.totalSpent += order.total;
                existing.orders.push(order.orderNumber);
                if (order.createdAt > existing.lastOrderDate) {
                    existing.lastOrderDate = order.createdAt;
                    // Update to latest info
                    existing.name = order.customerName;
                    existing.city = order.city;
                    existing.address = order.address;
                    // Update email if provided in latest order
                    if (order.email) {
                        existing.email = order.email;
                    }
                }
            } else {
                // Add new customer
                customersMap.set(order.phone, {
                    name: order.customerName,
                    phone: order.phone,
                    email: order.email || '',  // Include email from order
                    city: order.city,
                    address: order.address,
                    totalOrders: 1,
                    totalSpent: order.total,
                    lastOrderDate: order.createdAt,
                    orders: [order.orderNumber]
                });
            }
        });

        // Convert map to array and sort by total spent (descending)
        const customers = Array.from(customersMap.values())
            .map(customer => ({
                id: customer.phone, // Use phone as unique ID
                name: customer.name,
                phone: customer.phone,
                email: customer.email,
                city: customer.city,
                ordersCount: customer.totalOrders,
                totalSpent: customer.totalSpent,
                lastOrderDate: customer.lastOrderDate
            }))
            .sort((a, b) => b.totalSpent - a.totalSpent);

        res.json(customers);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ error: 'Failed to fetch customers' });
    }
});

// GET /api/customers/:customerId/orders - Get all orders for a specific customer
router.get('/:customerId/orders', authenticate, authorize(['super_admin', 'editor', 'viewer']), async (req: Request, res: Response) => {
    try {
        const { customerId } = req.params;

        // Fetch all orders for this customer (using phone as identifier)
        const orders = await prisma.order.findMany({
            where: {
                phone: customerId
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json(orders);
    } catch (error) {
        console.error('Error fetching customer orders:', error);
        res.status(500).json({ error: 'Failed to fetch customer orders' });
    }
});

export default router;
