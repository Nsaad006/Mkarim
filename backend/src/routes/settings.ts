import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticate, authorize } from './auth';

const router = Router();

// GET /api/settings - Public settings
router.get('/', async (req: Request, res: Response) => {
    try {
        // Get or create settings (singleton pattern)
        let settings = await prisma.settings.findFirst();

        if (!settings) {
            // Create default settings if none exist
            settings = await prisma.settings.create({
                data: {}
            });
        }

        res.json(settings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

// PUT /api/settings - Update settings (super_admin and editor)
router.put('/', authenticate, authorize(['super_admin', 'editor']), async (req: Request, res: Response) => {
    try {
        const {
            storeName,
            storeAvailability,
            codEnabled,
            whatsappNumber,
            currency,
            contactAddress,
            contactPhone,
            contactEmail,
            contactHours,
            footerDescription,
            footerCopyright,
            aboutTitle,
            aboutDescription,
            aboutMission,
            facebookLink,
            instagramLink,
            twitterLink,
            youtubeLink,
            tiktokLink,
            categoriesTitle,
            categoriesSubtitle,
            featuredTitle,
            featuredSubtitle,
            whyTitle,
            whySubtitle,
            ctaTitle,
            ctaSubtitle,
            ctaPrimaryBtnText,
            ctaPrimaryBtnLink,
            ctaSecondaryBtnText,
            ctaSecondaryBtnLink
        } = req.body;

        // Get existing settings or create if none exist
        let settings = await prisma.settings.findFirst();

        if (!settings) {
            settings = await prisma.settings.create({
                data: {}
            });
        }

        // Update settings
        const updatedSettings = await prisma.settings.update({
            where: { id: settings.id },
            data: {
                ...(storeName !== undefined && { storeName }),
                ...(storeAvailability !== undefined && { storeAvailability }),
                ...(codEnabled !== undefined && { codEnabled }),
                ...(whatsappNumber !== undefined && { whatsappNumber }),
                ...(currency !== undefined && { currency }),
                ...(contactAddress !== undefined && { contactAddress }),
                ...(contactPhone !== undefined && { contactPhone }),
                ...(contactEmail !== undefined && { contactEmail }),
                ...(contactHours !== undefined && { contactHours }),
                ...(footerDescription !== undefined && { footerDescription }),
                ...(footerCopyright !== undefined && { footerCopyright }),
                ...(aboutTitle !== undefined && { aboutTitle }),
                ...(aboutDescription !== undefined && { aboutDescription }),
                ...(aboutMission !== undefined && { aboutMission }),
                ...(facebookLink !== undefined && { facebookLink }),
                ...(instagramLink !== undefined && { instagramLink }),
                ...(twitterLink !== undefined && { twitterLink }),
                ...(youtubeLink !== undefined && { youtubeLink }),
                ...(tiktokLink !== undefined && { tiktokLink }),
                ...(categoriesTitle !== undefined && { categoriesTitle }),
                ...(categoriesSubtitle !== undefined && { categoriesSubtitle }),
                ...(featuredTitle !== undefined && { featuredTitle }),
                ...(featuredSubtitle !== undefined && { featuredSubtitle }),
                ...(whyTitle !== undefined && { whyTitle }),
                ...(whySubtitle !== undefined && { whySubtitle }),
                ...(ctaTitle !== undefined && { ctaTitle }),
                ...(ctaSubtitle !== undefined && { ctaSubtitle }),
                ...(ctaPrimaryBtnText !== undefined && { ctaPrimaryBtnText }),
                ...(ctaPrimaryBtnLink !== undefined && { ctaPrimaryBtnLink }),
                ...(ctaSecondaryBtnText !== undefined && { ctaSecondaryBtnText }),
                ...(ctaSecondaryBtnLink !== undefined && { ctaSecondaryBtnLink })
            }
        });

        res.json(updatedSettings);
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ error: 'Failed to update settings' });
    }
});

export default router;
