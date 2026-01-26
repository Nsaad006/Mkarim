import { sendEmail } from './src/lib/email';
import prisma from './src/lib/prisma';

async function testEmail() {
    console.log('🧪 Starting email test...');
    try {
        const settings = await prisma.settings.findFirst();
        if (!settings) {
            console.error('❌ No settings found in database.');
            return;
        }

        console.log('Current Email Settings:');
        console.log('- Enabled:', settings.emailEnabled);
        console.log('- Gmail User:', settings.emailGmailUser);
        console.log('- Admin Receiver:', settings.emailAdminReceiver);
        console.log('- Has Client ID:', !!settings.emailClientId);
        console.log('- Has Client Secret:', !!settings.emailClientSecret);
        console.log('- Has Refresh Token:', !!settings.emailRefreshToken);

        if (!settings.emailEnabled) {
            console.log('⚠️ Email is disabled. Enabling it for this test...');
        }

        const testOrder = {
            orderNumber: 'TEST-123',
            customerName: 'Test User',
            email: settings.emailAdminReceiver || settings.emailGmailUser,
            phone: '0600000000',
            city: 'Casablanca',
            address: 'Test Address',
            total: 1500,
            items: [
                {
                    product: { name: 'Produit Test' },
                    quantity: 1,
                    price: 1500
                }
            ]
        };

        console.log('📧 Attempting to send test email to:', testOrder.email);

        // Temporarily override enabled status for test
        const originalEnabled = settings.emailEnabled;
        (settings as any).emailEnabled = true;

        const info = await sendEmail(
            testOrder.email!,
            'Test Email - Maroc Cash Flow',
            '<h1>Ceci est un test</h1><p>Si vous voyez ce message, la configuration email fonctionne !</p>'
        );

        console.log('✅ Success! Email sent info:', info);
    } catch (error) {
        console.error('❌ FAILURE in email test:');
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

testEmail();
