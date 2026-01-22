import { Router, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../lib/prisma';
import { authenticate, authorize } from './auth';

const router = Router();

// GET /api/products - List all products with optional filters
router.get('/', async (req, res) => {
    try {
        const { categoryId, category, inStock, search } = req.query;

        const where: Prisma.ProductWhereInput = {};

        // Support both categoryId (UUID or slug) and category (slug)
        const categoryIdentifier = categoryId || category;
        if (categoryIdentifier) {
            const categoryStr = String(categoryIdentifier);

            // Check if it's a UUID (contains hyphens and is 36 chars) or a slug
            const isUUID = categoryStr.includes('-') && categoryStr.length === 36;

            if (isUUID) {
                // It's a UUID, use directly
                where.categoryId = categoryStr;
            } else {
                // It's a slug, look up the category first (only active categories)
                const categoryRecord = await prisma.category.findUnique({
                    where: { slug: categoryStr, active: true }
                });
                if (categoryRecord) {
                    where.categoryId = categoryRecord.id;
                }
            }
        }

        if (inStock !== undefined) {
            where.inStock = inStock === 'true';
        }

        if (search) {
            const searchStr = String(search).toLowerCase();
            where.OR = [
                { name: { contains: searchStr, mode: 'insensitive' } },
                { description: { contains: searchStr, mode: 'insensitive' } }
            ];
        }

        const products = await prisma.product.findMany({
            where: {
                ...where,
                category: {
                    active: true
                }
            },
            include: {
                category: true
            }
        });

        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req, res) => {
    try {
        const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];

        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                category: true
            }
        });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// POST /api/products - Create product (admin)
router.post('/', authenticate, authorize(['super_admin', 'editor']), async (req: Request, res: Response) => {
    try {
        const { name, description, price, originalPrice, image, images, categoryId, inStock, quantity, badge, specs } = req.body;

        // Handle images array - ensure it's an array
        const imageArray = images && Array.isArray(images) ? images : (image ? [image] : []);
        const primaryImage = imageArray[0] || image || '';

        const newProduct = await prisma.product.create({
            data: {
                name,
                description,
                price: Number(price),
                originalPrice: originalPrice ? Number(originalPrice) : null,
                image: primaryImage,  // First image as primary
                images: imageArray,    // All images
                categoryId,
                inStock: inStock ?? true,
                quantity: Number(quantity) || 0,
                badge,
                specs: specs || []
            },
            include: {
                category: true
            }
        });

        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Failed to create product' });
    }
});

// PUT /api/products/:id - Update product (admin)
router.put('/:id', authenticate, authorize(['super_admin', 'editor']), async (req: Request, res: Response) => {
    try {
        const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];
        const { name, description, price, originalPrice, image, images, categoryId, inStock, quantity, badge, specs } = req.body;

        const updateData: any = {
            ...(name && { name }),
            ...(description && { description }),
            ...(price !== undefined && { price: Number(price) }),
            ...(originalPrice !== undefined && { originalPrice: originalPrice ? Number(originalPrice) : null }),
            ...(categoryId && { categoryId }),
            ...(inStock !== undefined && { inStock: Boolean(inStock) }),
            ...(quantity !== undefined && { quantity: Number(quantity) }),
            ...(badge !== undefined && { badge }),
            ...(specs && { specs })
        };

        // Handle images array update
        if (images !== undefined) {
            const imageArray = Array.isArray(images) ? images : (images ? [images] : []);
            updateData.images = imageArray;
            updateData.image = imageArray[0] || '';  // Update primary image
        } else if (image !== undefined) {
            // Backward compatibility: if only image is provided
            updateData.image = image;
        }

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: updateData,
            include: {
                category: true
            }
        });

        res.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        if ((error as Prisma.PrismaClientKnownRequestError).code === 'P2025') {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// DELETE /api/products/:id - Delete product (admin)
router.delete('/:id', authenticate, authorize(['super_admin', 'editor']), async (req: Request, res: Response) => {
    try {
        const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];

        // Check if product exists in any orders
        const ordersWithProduct = await prisma.orderItem.findFirst({
            where: { productId: id }
        });

        if (ordersWithProduct) {
            return res.status(400).json({
                error: 'Cannot delete product that exists in orders. Consider marking it as out of stock instead.'
            });
        }

        await prisma.product.delete({
            where: { id }
        });

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting product:', error);
        if ((error as Prisma.PrismaClientKnownRequestError).code === 'P2025') {
            return res.status(404).json({ error: 'Product not found' });
        }
        if ((error as Prisma.PrismaClientKnownRequestError).code === 'P2003') {
            return res.status(400).json({
                error: 'Cannot delete product due to existing references. Please contact support.'
            });
        }
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

export default router;
