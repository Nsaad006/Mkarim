import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAdmin() {
    console.log('Checking admin users...\n');

    const admins = await prisma.admin.findMany();
    console.log(`Found ${admins.length} admin(s):\n`);

    for (const admin of admins) {
        console.log('Admin:', {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            password: admin.password,
            active: admin.active,
            role: admin.role
        });
    }

    // Test specific admin
    const testAdmin = await prisma.admin.findUnique({
        where: { email: 'admin@mkarim.ma' }
    });

    console.log('\nTest admin (admin@mkarim.ma):', testAdmin);

    if (testAdmin) {
        console.log('\nPassword match test:');
        console.log('  Stored password:', testAdmin.password);
        console.log('  Test password: 123456');
        console.log('  Match:', testAdmin.password === '123456');
        console.log('  Active:', testAdmin.active);
    }
}

checkAdmin()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
