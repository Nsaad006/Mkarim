import { Router, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { authenticate, authorize } from './auth';

const router = Router();

// Validation schema for Moroccan phone numbers
const phoneRegex = /^(\+212|0)[5-7]\d{8}$/;

const createOrderSchema = z.object({
    items: z.array(z.object({
        productId: z.string(),
        quantity: z.number().int().positive()
    })).min(1, 'Votre panier est vide'),
    customerName: z.string().min(2, "Merci de saisir votre nom complet (min 2 caractères)"),
    email: z.string().email("Merci de saisir une adresse email valide"),
    phone: z.string().regex(phoneRegex, 'Merci de saisir un numéro de téléphone marocain valide (Ex: 06XXXXXXXX)'),
    city: z.string().min(2, "Merci de sélectionner votre ville"),
    address: z.string().min(5, "Merci de saisir votre adresse complète (min 5 caractères)")
});

// Generate order number
function generateOrderNumber(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${timestamp}${random}`;
}

import { sendOrderEmails } from '../lib/email';

// POST /api/orders - Create new COD order (Multi-item)
router.post('/', async (req, res) => {
    try {
        // ... (rest of validation and total calculation remains the same)
        const validatedData = createOrderSchema.parse(req.body);

        // Find products and calculate total
        let total = 0;
        const orderItems = [];

        for (const item of validatedData.items) {
            const product = await prisma.product.findUnique({
                where: { id: item.productId }
            });

            if (!product) {
                return res.status(404).json({ error: `Product ${item.productId} not found` });
            }
            if (!product.inStock || product.quantity < item.quantity) {
                return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
            }

            total += product.price * item.quantity;

            orderItems.push({
                productId: item.productId,
                quantity: item.quantity,
                price: product.price
            });

            // Decrement stock
            await prisma.product.update({
                where: { id: item.productId },
                data: {
                    quantity: product.quantity - item.quantity,
                    inStock: product.quantity - item.quantity > 0
                }
            });
        }

        // Create or update customer record for persistent tracking
        const customer = await prisma.customer.upsert({
            where: { phone: validatedData.phone },
            update: {
                name: validatedData.customerName,
                email: validatedData.email || null,
                city: validatedData.city,
                address: validatedData.address,
            },
            create: {
                name: validatedData.customerName,
                email: validatedData.email || null,
                phone: validatedData.phone,
                city: validatedData.city,
                address: validatedData.address,
            }
        });

        const newOrder = await prisma.order.create({
            data: {
                orderNumber: generateOrderNumber(),
                customerId: customer.id,
                customerName: validatedData.customerName,
                email: validatedData.email || null,
                phone: validatedData.phone,
                city: validatedData.city,
                address: validatedData.address,
                total: total,
                status: 'PENDING',
                items: {
                    create: orderItems
                }
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        // Trigger email notification (don't await to not delay response, or await for confirmation)
        // We'll use a detached execution or wrapped in try-catch to not break response
        sendOrderEmails(newOrder).catch(err => console.error('Error in sendOrderEmails background task:', err));

        res.status(201).json(newOrder);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                error: 'Validation failed',
                details: error.issues
            });
        }

        console.error('Error creating order:', error);
        res.status(500).json({ error: (error as Error).message || 'Failed to create order' });
    }
});

// GET /api/orders - List all orders (admin/editor/viewer/commercial/magasinier)
router.get('/', authenticate, authorize(['super_admin', 'editor', 'viewer', 'commercial', 'magasinier']), async (req: Request, res: Response) => {
    try {
        const { status, city } = req.query;
        const user = (req as any).user; // Get authenticated user

        const where: Prisma.OrderWhereInput = {};

        // Role-based filtering
        if (user.role === 'magasinier') {
            // Magasinier can only see CONFIRMED, SHIPPED, and DELIVERED orders
            where.status = {
                in: ['CONFIRMED', 'SHIPPED', 'DELIVERED']
            };
        }
        // Commercial and other roles can see all orders

        if (status) {
            // If magasinier, ensure they can only filter within their allowed statuses
            if (user.role === 'magasinier') {
                const requestedStatus = String(status) as import('@prisma/client').OrderStatus;
                if (['CONFIRMED', 'SHIPPED', 'DELIVERED'].includes(requestedStatus)) {
                    where.status = requestedStatus;
                }
            } else {
                where.status = String(status) as import('@prisma/client').OrderStatus;
            }
        }

        if (city) {
            where.city = String(city);
        }

        const orders = await prisma.order.findMany({
            where,
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
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// GET /api/orders/:id - Get order details (admin/editor/viewer/commercial/magasinier)
router.get('/:id', authenticate, authorize(['super_admin', 'editor', 'viewer', 'commercial', 'magasinier']), async (req: Request, res: Response) => {
    try {
        const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];

        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
});

// PATCH /api/orders/:id/status - Update order status (super_admin/editor/commercial/magasinier)
router.patch('/:id/status', authenticate, authorize(['super_admin', 'editor', 'commercial', 'magasinier']), async (req: Request, res: Response) => {
    try {
        const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];
        const { status } = req.body;
        const user = (req as any).user;

        // Role-based status update restrictions
        if (user.role === 'commercial') {
            // Commercial can only CONFIRM or CANCEL orders
            if (!['CONFIRMED', 'CANCELLED'].includes(status)) {
                return res.status(403).json({
                    error: 'Commercial can only confirm or cancel orders'
                });
            }

            // Get current order to check its status
            const order = await prisma.order.findUnique({
                where: { id }
            });

            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }

            // Commercial can only CONFIRM orders that are PENDING
            if (status === 'CONFIRMED' && order.status !== 'PENDING') {
                return res.status(403).json({
                    error: 'Vous ne pouvez confirmer que les commandes en attente'
                });
            }

            // Commercial can only CANCEL orders that are PENDING or CONFIRMED
            if (status === 'CANCELLED' && !['PENDING', 'CONFIRMED'].includes(order.status)) {
                return res.status(403).json({
                    error: 'Vous ne pouvez annuler que les commandes en attente ou confirmées'
                });
            }

            // Cannot modify orders that are already SHIPPED, DELIVERED, or CANCELLED
            if (['SHIPPED', 'DELIVERED', 'CANCELLED'].includes(order.status) && status !== 'CANCELLED') {
                return res.status(403).json({
                    error: 'Cette commande ne peut plus être modifiée'
                });
            }
        } else if (user.role === 'magasinier') {
            // Magasinier can only set SHIPPED or DELIVERED
            if (!['SHIPPED', 'DELIVERED'].includes(status)) {
                return res.status(403).json({
                    error: 'Magasinier can only set orders to shipped or delivered'
                });
            }

            // Magasinier can only update orders that are already CONFIRMED
            const order = await prisma.order.findUnique({
                where: { id }
            });

            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }

            if (!['CONFIRMED', 'SHIPPED'].includes(order.status)) {
                return res.status(403).json({
                    error: 'Magasinier can only update confirmed or shipped orders'
                });
            }
        }

        const updatedOrder = await prisma.order.update({
            where: { id },
            data: { status },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        res.json(updatedOrder);
    } catch (error) {
        console.error('Error updating order status:', error);
        if ((error as Prisma.PrismaClientKnownRequestError).code === 'P2025') {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(500).json({ error: 'Failed to update order status' });
    }
});

export default router;
