import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...\n');

    // 1. Seed Admin User
    console.log('👤 Seeding admin user...');
    const hashedPassword = await bcrypt.hash('123456', 10);
    const admin = await prisma.admin.upsert({
        where: { email: 'admin@mkarim.ma' },
        update: { password: hashedPassword },
        create: {
            email: 'admin@mkarim.ma',
            password: hashedPassword,
            name: 'Admin Principal',
            role: 'super_admin',
            active: true
        }
    });
    console.log(`   ✅ Admin user created: ${admin.email}\n`);

    // 2. Seed Settings
    console.log('⚙️ Seeding global settings...');
    await prisma.settings.upsert({
        where: { id: 'global-settings' },
        update: {},
        create: {
            id: 'global-settings',
            storeName: 'MKARIM SOLUTION',
            storeAvailability: true,
            codEnabled: true,
            whatsappNumber: '+212 6 00 00 00 00',
            currency: 'MAD',
            contactAddress: 'Casablanca, Maroc',
            contactPhone: '+212 6 00 00 00 00',
            contactEmail: 'contact@mkarim.ma',
            footerDescription: 'Votre destination ultime pour le gaming au Maroc. Performance, passion et innovation au service des gamers.',
            footerCopyright: '© 2025 MKARIM SOLUTION – Engineered for Gamers',
            emailEnabled: false
        }
    });
    console.log('   ✅ Settings updated\n');

    // 3. Seed Categories
    console.log('📁 Seeding categories...');
    const categoriesData = [
        { name: 'PC Portable', slug: 'laptops', icon: 'Laptop' },
        { name: 'PC de Bureau', slug: 'desktops', icon: 'Cpu' },
        { name: 'PC Gamer', slug: 'gaming-pc', icon: 'Gamepad2' },
        { name: 'Moniteurs', slug: 'monitors', icon: 'Monitor' },
        { name: 'Écrans Gamer', slug: 'gaming-monitors', icon: 'Tv' },
        { name: 'Souris Gamer', slug: 'gaming-mice', icon: 'Mouse' },
        { name: 'Claviers Gamer', slug: 'gaming-keyboards', icon: 'Keyboard' },
        { name: 'Casques Gamer', slug: 'gaming-headsets', icon: 'Headset' },
        { name: 'AirPods & Écouteurs', slug: 'earphones', icon: 'Bluetooth' },
        { name: 'Accessoires', slug: 'it-accessories', icon: 'Cable' },
        { name: 'Composants', slug: 'components', icon: 'Cpu' },
        { name: 'Électronique', slug: 'electronics', icon: 'Zap' }
    ];

    const createdCategories: Record<string, any> = {};
    for (const cat of categoriesData) {
        const category = await prisma.category.upsert({
            where: { slug: cat.slug },
            update: { name: cat.name, icon: cat.icon },
            create: {
                name: cat.name,
                slug: cat.slug,
                icon: cat.icon,
                active: true
            }
        });
        createdCategories[cat.slug] = category;
        console.log(`   ✅ ${category.name}`);
    }
    console.log('');

    // 4. Seed Cities
    console.log('🏙️  Seeding cities...');
    const citiesData = [
        { name: 'Casablanca', shippingFee: 20, deliveryTime: '24h' },
        { name: 'Rabat', shippingFee: 25, deliveryTime: '24h' },
        { name: 'Marrakech', shippingFee: 30, deliveryTime: '48h' },
        { name: 'Fès', shippingFee: 30, deliveryTime: '48h' },
        { name: 'Tanger', shippingFee: 35, deliveryTime: '48h' },
        { name: 'Agadir', shippingFee: 40, deliveryTime: '72h' }
    ];

    for (const city of citiesData) {
        await prisma.city.upsert({
            where: { name: city.name },
            update: city,
            create: { ...city, active: true }
        });
        console.log(`   ✅ ${city.name}`);
    }
    console.log('');

    // 5. Seed Products
    console.log('🛒 Seeding products...');
    const productsData = [
        {
            name: 'PC Portable Dell XPS 15',
            description: 'Ultrabook professionnel avec écran 4K',
            price: 15999,
            originalPrice: 17999,
            image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600',
            categoryId: createdCategories['laptops'].id,
            quantity: 30,
            badge: 'Nouveau',
            specs: ['Intel i7-12700H', '16GB RAM', '512GB SSD', 'Écran 15.6" 4K']
        },
        {
            name: 'MacBook Pro 14" M3',
            description: 'Performance exceptionnelle pour les créatifs',
            price: 24999,
            originalPrice: null,
            image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600',
            categoryId: createdCategories['laptops'].id,
            quantity: 15,
            badge: 'Bestseller',
            specs: ['Apple M3', '16GB RAM', '512GB SSD', 'Écran Retina 14"']
        },
        {
            name: 'PC Gamer MKARIM Pro RTX 4070',
            description: 'PC Gaming haute performance avec RTX 4070, Intel i7, 32GB RAM',
            price: 18999,
            originalPrice: 21999,
            image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600',
            categoryId: createdCategories['gaming-pc'].id,
            quantity: 50,
            badge: 'Bestseller',
            specs: ['Intel Core i7-13700K', 'RTX 4070 12GB', '32GB DDR5', '1TB NVMe SSD']
        },
        {
            name: 'Logitech G Pro X Superlight',
            description: 'Souris gaming sans fil ultra-légère',
            price: 1499,
            originalPrice: null,
            image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=600',
            categoryId: createdCategories['gaming-mice'].id,
            quantity: 60,
            badge: 'Pro',
            specs: ['Sans fil', '63g', 'Hero 25K', '70h autonomie']
        },
        {
            name: 'Razer BlackWidow V3',
            description: 'Clavier mécanique RGB gaming',
            price: 1899,
            originalPrice: 2199,
            image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=600',
            categoryId: createdCategories['gaming-keyboards'].id,
            quantity: 35,
            badge: 'Promo',
            specs: ['Switches mécaniques', 'RGB Chroma', 'Repose-poignet', 'USB-C']
        }
    ];

    for (const prod of productsData) {
        // We use name as a matching key for seeding since IDs change
        const existing = await prisma.product.findFirst({ where: { name: prod.name } });
        if (existing) {
            await prisma.product.update({
                where: { id: existing.id },
                data: prod
            });
        } else {
            await prisma.product.create({
                data: {
                    ...prod,
                    inStock: prod.quantity > 0
                }
            });
        }
        console.log(`   ✅ ${prod.name}`);
    }

    // 6. Seed Hero Slides
    console.log('\n🎞️ Seeding hero slides...');
    const slides = [
        {
            title: 'Dominez le Champ de Bataille',
            subtitle: 'PROMOTIONS EXCLUSIVES',
            description: 'PCs Gaming haute performance configurés pour la victoire. Jusqu\'à -20% sur la série RTX Elite.',
            image: 'https://images.unsplash.com/photo-1587202376732-834907a75932?q=80&w=2070&auto=format&fit=crop',
            buttonText: 'Acheter Maintenant',
            buttonLink: '/products',
            badge: 'Offre Limitée',
            order: 0,
            active: true
        }
    ];

    for (const slide of slides) {
        const existing = await prisma.heroSlide.findFirst({ where: { title: slide.title } });
        if (existing) {
            await prisma.heroSlide.update({ where: { id: existing.id }, data: slide });
        } else {
            await prisma.heroSlide.create({ data: slide });
        }
    }
    console.log('   ✅ Hero slides updated');

    console.log('\n✨ Database seeded successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
