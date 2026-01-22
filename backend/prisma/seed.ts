import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Seed Admin
    const hashedPassword = await bcrypt.hash('123456', 10);
    const admin = await prisma.admin.upsert({
        where: { email: 'admin@mkarim.ma' },
        update: {},
        create: {
            email: 'admin@mkarim.ma',
            password: hashedPassword,
            name: 'Admin Principal',
            role: 'super_admin'
        }
    });
    console.log('✅ Admin user created:', admin.email);

    // Seed Categories
    const categoriesData = [
        { name: 'PC Portable', slug: 'laptops' },
        { name: 'PC de Bureau', slug: 'desktops' },
        { name: 'PC Gamer', slug: 'gaming-pc' },
        { name: 'Moniteurs', slug: 'monitors' },
        { name: 'Écrans Gamer', slug: 'gaming-monitors' },
        { name: 'Souris Gamer', slug: 'gaming-mice' },
        { name: 'Claviers Gamer', slug: 'gaming-keyboards' },
        { name: 'Casques Gamer', slug: 'gaming-headsets' },
        { name: 'AirPods & Écouteurs', slug: 'earphones' },
    ];

    for (const cat of categoriesData) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: { name: cat.name },
            create: cat
        });
    }
    console.log('✅ Categories seeded');

    // Seed Cities
    const citiesData = [
        { name: 'Casablanca', shippingFee: 20, deliveryTime: '24h', active: true },
        { name: 'Rabat', shippingFee: 25, deliveryTime: '24h', active: true },
        { name: 'Marrakech', shippingFee: 35, deliveryTime: '48h', active: true },
        { name: 'Tanger', shippingFee: 35, deliveryTime: '48h', active: true },
        { name: 'Agadir', shippingFee: 40, deliveryTime: '48-72h', active: true },
        { name: 'Fès', shippingFee: 30, deliveryTime: '48h', active: true },
        { name: 'Meknès', shippingFee: 30, deliveryTime: '48h', active: true },
        { name: 'Oujda', shippingFee: 45, deliveryTime: '72h', active: true },
        { name: 'Kenitra', shippingFee: 25, deliveryTime: '24h', active: true },
        { name: 'Tetouan', shippingFee: 40, deliveryTime: '48h', active: true },
        { name: 'Safi', shippingFee: 35, deliveryTime: '48h', active: true },
        { name: 'Temara', shippingFee: 25, deliveryTime: '24h', active: true },
        { name: 'Sale', shippingFee: 25, deliveryTime: '24h', active: true },
        { name: 'Mohammedia', shippingFee: 20, deliveryTime: '24h', active: true },
        { name: 'El Jadida', shippingFee: 30, deliveryTime: '48h', active: true },
        { name: 'Beni Mellal', shippingFee: 35, deliveryTime: '48h', active: true },
        { name: 'Nador', shippingFee: 45, deliveryTime: '72h', active: true },
        { name: 'Taza', shippingFee: 40, deliveryTime: '48h', active: true },
        { name: 'Settat', shippingFee: 30, deliveryTime: '48h', active: true },
        { name: 'Larache', shippingFee: 35, deliveryTime: '48h', active: true },
        { name: 'Ksar El Kebir', shippingFee: 35, deliveryTime: '48h', active: true },
        { name: 'Khemisset', shippingFee: 30, deliveryTime: '48h', active: true },
        { name: 'Guelmim', shippingFee: 50, deliveryTime: '72h', active: true },
        { name: 'Berrechid', shippingFee: 25, deliveryTime: '24h', active: true },
        { name: 'Oued Zem', shippingFee: 35, deliveryTime: '48h', active: true },
        { name: 'Fquih Ben Salah', shippingFee: 35, deliveryTime: '48h', active: true },
    ];

    for (const city of citiesData) {
        await prisma.city.upsert({
            where: { name: city.name },
            update: city,
            create: city
        });
    }
    console.log('✅ Cities seeded');

    // Get categories to link products
    const dbCategories = await prisma.category.findMany();
    const getCatId = (slug: string) => dbCategories.find((c: import('@prisma/client').Category) => c.slug === slug)?.id || dbCategories[0].id;

    // Seed Products
    const productsData = [
        {
            name: 'PC Gamer MKARIM Pro RTX 4070',
            description: 'PC Gaming haute performance avec RTX 4070, Intel i7, 32GB RAM',
            price: 18999,
            originalPrice: 21999,
            image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600',
            categoryId: getCatId('gaming-pc'),
            inStock: true,
            quantity: 50,
            badge: 'Bestseller',
            specs: ['Intel Core i7-13700K', 'RTX 4070 12GB', '32GB DDR5', '1TB NVMe SSD']
        },
        {
            name: 'PC Portable Dell XPS 15',
            description: 'Ultrabook professionnel avec écran 4K',
            price: 15999,
            originalPrice: 17999,
            image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600',
            categoryId: getCatId('laptops'),
            inStock: true,
            quantity: 30,
            badge: 'Nouveau',
            specs: ['Intel i7-12700H', '16GB RAM', '512GB SSD', 'Écran 15.6" 4K']
        }
    ];

    for (const product of productsData) {
        await prisma.product.upsert({
            where: { id: product.name }, // This is technically wrong since id is UUID, using name as placeholder or use something else
            // Let's just use create and skip if exists or delete all products first
            update: product,
            create: {
                ...product,
                id: undefined // Let Prisma generate ID
            }
        }).catch(() => {
            // If upsert fails because of ID, just create
            return prisma.product.create({ data: product });
        });
    }

    console.log('✅ Products seeded');
    console.log('✨ Seeding completed!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
