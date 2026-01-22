import { Router } from 'express';
import { upload } from '../middleware/upload';
import { authenticate, authorize } from './auth';

const router = Router();

// POST /api/upload/product-image (single)
router.post('/product-image',
    authenticate,
    authorize(['super_admin', 'editor']),
    upload.single('image'),
    (req, res) => {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Return the file path that can be used in the product
        const imageUrl = `/uploads/products/${req.file.filename}`;
        res.json({ imageUrl });
    }
);

// POST /api/upload/product-images (multiple - max 6)
router.post('/product-images',
    authenticate,
    authorize(['super_admin', 'editor']),
    upload.array('images', 6),  // Max 6 images
    (req, res) => {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        // Return array of file paths
        const imageUrls = req.files.map(file => `/uploads/products/${file.filename}`);
        res.json({ imageUrls });
    }
);

export default router;
