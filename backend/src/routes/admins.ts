import { Router, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { authenticate, authorize } from './auth';
import bcrypt from 'bcryptjs';

const router = Router();

const createAdminSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['super_admin', 'editor', 'viewer', 'commercial', 'magasinier']),
});

// GET /api/admins - List all admins (super_admin only)
router.get('/', authenticate, authorize(['super_admin']), async (req: Request, res: Response) => {
    try {
        const admins = await prisma.admin.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                active: true,
                createdAt: true
            }
        });
        res.json(admins);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch admins' });
    }
});

// POST /api/admins - Create new admin (super_admin only)
router.post('/', authenticate, authorize(['super_admin']), async (req: Request, res: Response) => {
    try {
        const validatedData = createAdminSchema.parse(req.body);

        // Check if email already exists
        const existing = await prisma.admin.findUnique({
            where: { email: validatedData.email }
        });

        if (existing) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(validatedData.password, 10);

        const newAdmin = await prisma.admin.create({
            data: {
                name: validatedData.name,
                email: validatedData.email,
                password: hashedPassword,
                role: validatedData.role,
                active: true
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                active: true,
                createdAt: true
            }
        });

        res.status(201).json(newAdmin);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation failed', details: error.issues });
        }
        res.status(500).json({ error: 'Failed to create admin' });
    }
});

// DELETE /api/admins/:id - Delete an admin (super_admin only)
router.delete('/:id', authenticate, authorize(['super_admin']), async (req: Request, res: Response) => {
    try {
        const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];

        const admin = await prisma.admin.findUnique({
            where: { id }
        });

        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        // Prevent deleting the main admin
        if (admin.email === 'admin@mkarim.ma') {
            return res.status(403).json({ error: 'Main admin cannot be deleted' });
        }

        await prisma.admin.delete({
            where: { id }
        });

        res.json({ message: 'Admin deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete admin' });
    }
});

// PATCH /api/admins/:id/status - Update admin status (super_admin only)
router.patch('/:id/status', authenticate, authorize(['super_admin']), async (req: Request, res: Response) => {
    try {
        const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];
        const { active } = req.body;

        const updatedAdmin = await prisma.admin.update({
            where: { id },
            data: { active },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                active: true,
                createdAt: true
            }
        });

        res.json(updatedAdmin);
    } catch (error) {
        if ((error as Prisma.PrismaClientKnownRequestError).code === 'P2025') {
            return res.status(404).json({ error: 'Admin not found' });
        }
        res.status(500).json({ error: 'Failed to update status' });
    }
});

// PATCH /api/admins/:id/role - Update admin role (super_admin only)
router.patch('/:id/role', authenticate, authorize(['super_admin']), async (req: Request, res: Response) => {
    try {
        const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];
        const { role } = req.body;

        // Validate role
        if (!['super_admin', 'editor', 'viewer', 'commercial', 'magasinier'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        const admin = await prisma.admin.findUnique({
            where: { id }
        });

        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        // Prevent changing the main admin's role
        if (admin.email === 'admin@mkarim.ma') {
            return res.status(403).json({ error: 'Cannot change main admin role' });
        }

        const updatedAdmin = await prisma.admin.update({
            where: { id },
            data: { role },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                active: true,
                createdAt: true
            }
        });

        res.json(updatedAdmin);
    } catch (error) {
        if ((error as Prisma.PrismaClientKnownRequestError).code === 'P2025') {
            return res.status(404).json({ error: 'Admin not found' });
        }
        res.status(500).json({ error: 'Failed to update role' });
    }
});

// PATCH /api/admins/:id/password - Update admin password (super_admin only)
router.patch('/:id/password', authenticate, authorize(['super_admin']), async (req: Request, res: Response) => {
    try {
        const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];
        const { password } = req.body;

        // Validate password
        if (!password || password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        const admin = await prisma.admin.findUnique({
            where: { id }
        });

        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const updatedAdmin = await prisma.admin.update({
            where: { id },
            data: { password: hashedPassword },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                active: true,
                createdAt: true
            }
        });

        res.json(updatedAdmin);
    } catch (error) {
        if ((error as Prisma.PrismaClientKnownRequestError).code === 'P2025') {
            return res.status(404).json({ error: 'Admin not found' });
        }
        res.status(500).json({ error: 'Failed to update password' });
    }
});

export default router;
