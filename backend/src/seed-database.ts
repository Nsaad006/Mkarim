import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...\n');

    // 1. Seed Admin User
    console.log('👤 Seeding admin user...');
    const admin = await prisma.admin.upsert({
        where: { email: 'admin@mkarim.ma' },
        update: {},
        create: {
            email: 'admin@mkarim.ma',
            password: '123456', // Plain text for development
            name: 'Admin Principal',
            role: 'super_admin',
            active: true
        }
    });
    console.log(`   ✅ Admin user created: ${admin.email}\n`);

    // 2. Seed Categories
    console.log('📁 Seeding categories...');
    const categories = [
        { name: 'PC Portable', slug: 'laptops' },
        { name: 'PC de Bureau', slug: 'desktops' },
        { name: 'PC Gamer', slug: 'gaming-pc' },
        { name: 'Moniteurs', slug: 'monitors' },
        { name: 'Écrans Gamer', slug: 'gaming-monitors' },
        { name: 'Souris Gamer', slug: 'gaming-mice' },
        { name: 'Claviers Gamer', slug: 'gaming-keyboards' },
        { name: 'Casques Gamer', slug: 'gaming-headsets' },
        { name: 'Accessoires Gamer', slug: 'gaming-accessories' },
        { name: 'AirPods & Écouteurs', slug: 'earphones' },
        { name: 'Accessoires IT', slug: 'it-accessories' },
        { name: 'Électronique', slug: 'electronics' }
    ];

    const createdCategories: Record<string, import('@prisma/client').Category> = {};
    for (const cat of categories) {
        const category = await prisma.category.upsert({
            where: { slug: cat.slug },
            update: { name: cat.name },
            create: {
                name: cat.name,
                slug: cat.slug,
                active: true
            }
        });
        createdCategories[cat.slug] = category;
        console.log(`   ✅ ${category.name}`);
    }
    console.log('');

    // 3. Seed Cities
    console.log('🏙️  Seeding cities...');
    const cities = [
        { name: 'Casablanca', shippingFee: 20, deliveryTime: '24h' },
        { name: 'Rabat', shippingFee: 25, deliveryTime: '24h' },
        { name: 'Marrakech', shippingFee: 30, deliveryTime: '48h' },
        { name: 'Fès', shippingFee: 30, deliveryTime: '48h' },
        { name: 'Tanger', shippingFee: 35, deliveryTime: '48h' },
        { name: 'Agadir', shippingFee: 40, deliveryTime: '72h' }
    ];

    for (const city of cities) {
        await prisma.city.upsert({
            where: { name: city.name },
            update: {},
            create: city
        });
        console.log(`   ✅ ${city.name}`);
    }
    console.log('');

    // 4. Seed Products
    console.log('🛒 Seeding products...');
    const products = [
        // Laptops
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
            name: 'HP Pavilion 15',
            description: 'Ordinateur portable polyvalent pour tous les jours',
            price: 7999,
            originalPrice: 8999,
            image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600',
            categoryId: createdCategories['laptops'].id,
            quantity: 50,
            badge: null,
            specs: ['Intel i5-1235U', '8GB RAM', '256GB SSD', 'Écran 15.6" FHD']
        },

        // Gaming PCs
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
            name: 'PC Gamer RTX 4060 Ti',
            description: 'Configuration gaming équilibrée pour 1440p',
            price: 13999,
            originalPrice: 15999,
            image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600',
            categoryId: createdCategories['gaming-pc'].id,
            quantity: 25,
            badge: 'Promo',
            specs: ['AMD Ryzen 5 7600X', 'RTX 4060 Ti 8GB', '16GB DDR5', '500GB NVMe']
        },

        // Monitors
        {
            name: 'Écran Dell 27" 4K',
            description: 'Moniteur professionnel IPS 4K',
            price: 4999,
            originalPrice: null,
            image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600',
            categoryId: createdCategories['monitors'].id,
            quantity: 40,
            badge: null,
            specs: ['27 pouces', '4K UHD', 'IPS', '60Hz']
        },
        {
            name: 'Samsung Odyssey G7 32"',
            description: 'Écran gaming incurvé 240Hz',
            price: 8999,
            originalPrice: 9999,
            image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=600',
            categoryId: createdCategories['gaming-monitors'].id,
            quantity: 20,
            badge: 'Gaming',
            specs: ['32 pouces', 'QHD 1440p', '240Hz', 'Incurvé 1000R']
        },

        // Gaming Peripherals
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
        },
        {
            name: 'HyperX Cloud II',
            description: 'Casque gaming 7.1 surround',
            price: 999,
            originalPrice: null,
            image: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=600',
            categoryId: createdCategories['gaming-headsets'].id,
            quantity: 45,
            badge: null,
            specs: ['7.1 Surround', 'Micro antibruit', 'Coussinets mémoire', 'Compatible multi-plateforme']
        },

        // Earphones
        {
            name: 'AirPods Pro 2',
            description: 'Écouteurs sans fil avec réduction de bruit active',
            price: 2799,
            originalPrice: null,
            image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=600',
            categoryId: createdCategories['earphones'].id,
            quantity: 30,
            badge: 'Apple',
            specs: ['ANC', 'Audio spatial', 'USB-C', 'Jusqu\'à 30h']
        },

        // Accessories
        {
            name: 'Tapis de souris XXL RGB',
            description: 'Grand tapis gaming avec éclairage RGB',
            price: 299,
            originalPrice: 399,
            image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=600',
            categoryId: createdCategories['gaming-accessories'].id,
            quantity: 100,
            badge: 'Promo',
            specs: ['90x40cm', 'RGB', 'Surface tissu', 'Base antidérapante']
        },

        // Desktop
        {
            name: 'PC de Bureau Dell OptiPlex',
            description: 'PC professionnel compact et fiable',
            price: 6999,
            originalPrice: null,
            image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=600',
            categoryId: createdCategories['desktops'].id,
            quantity: 20,
            badge: null,
            specs: ['Intel i5-12400', '16GB RAM', '512GB SSD', 'Windows 11 Pro']
        },

        // IT Accessories
        {
            name: 'Hub USB-C 7-en-1',
            description: 'Adaptateur multiport pour MacBook et PC',
            price: 599,
            originalPrice: null,
            image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=600',
            categoryId: createdCategories['it-accessories'].id,
            quantity: 80,
            badge: null,
            specs: ['HDMI 4K', '3x USB 3.0', 'USB-C PD', 'Lecteur SD/microSD']
        },

        // Electronics
        {
            name: 'Webcam Logitech C920',
            description: 'Webcam Full HD pour visioconférence',
            price: 899,
            originalPrice: 999,
            image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=600',
            categoryId: createdCategories['electronics'].id,
            quantity: 40,
            badge: null,
            specs: ['Full HD 1080p', 'Autofocus', 'Micro stéréo', 'Compatible Windows/Mac']
        }
    ];

    for (const product of products) {
        await prisma.product.create({
            data: {
                ...product,
                inStock: product.quantity > 0
            }
        });
        console.log(`   ✅ ${product.name}`);
    }

    console.log('\n✨ Database seeded successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   - 1 Admin user`);
    console.log(`   - ${categories.length} Categories`);
    console.log(`   - ${cities.length} Cities`);
    console.log(`   - ${products.length} Products`);
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
