import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
    try {
        console.log('🔍 Verifying System Status...\n');

        // 1. Check Database Connection & Admin
        const adminCount = await prisma.admin.count();
        const admin = await prisma.admin.findUnique({ where: { email: 'admin@mkarim.ma' } });

        console.log('✅ Database Connection: OK');
        console.log(`👤 Admins: ${adminCount}`);

        if (admin) {
            const isHashed = admin.password.startsWith('$2');
            console.log(`   - Admin 'admin@mkarim.ma' found.`);
            console.log(`   - Password Hashed: ${isHashed ? 'YES ✅' : 'NO ❌'} (${admin.password.substring(0, 10)}...)`);
        } else {
            console.log(`   - Admin 'admin@mkarim.ma' NOT FOUND ❌`);
        }

        // 2. Check Seeded Data
        const categoriesCount = await prisma.category.count();
        const productsCount = await prisma.product.count();
        const suppliersCount = await prisma.supplier.count();
        const citiesCount = await prisma.city.count();

        console.log(`\n📦 Content Stats:`);
        console.log(`   - Categories: ${categoriesCount}`);
        console.log(`   - Products: ${productsCount}`);
        console.log(`   - Suppliers: ${suppliersCount}`);
        console.log(`   - Cities: ${citiesCount}`);

        if (categoriesCount > 0 && productsCount > 0 && suppliersCount > 0) {
            console.log('\n✅ Seeding appears to be CORRECT.');
        } else {
            console.log('\n⚠️ Seeding might be incomplete.');
        }

    } catch (error) {
        console.error('❌ Check Failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

check();
