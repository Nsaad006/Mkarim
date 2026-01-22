import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function testDatabase() {
  console.log('🔍 Starting comprehensive database tests...\n');

  try {
    // Test 1: Database Connection
    console.log('1️⃣ Testing database connection...');
    await prisma.$connect();
    console.log('   ✅ Database connected successfully\n');

    // Test 2: Categories
    console.log('2️⃣ Testing Categories table...');
    const categories = await prisma.category.findMany();
    console.log(`   ✅ Found ${categories.length} categories`);
    console.log(`   📋 Categories: ${categories.map(c => c.name).join(', ')}\n`);

    // Test 3: Cities
    console.log('3️⃣ Testing Cities table...');
    const cities = await prisma.city.findMany({ take: 5 });
    console.log(`   ✅ Found ${cities.length} cities (showing first 5)`);
    cities.forEach(city => {
      console.log(`   📍 ${city.name}: ${city.shippingFee} MAD, ${city.deliveryTime}`);
    });
    console.log('');

    // Test 4: Products
    console.log('4️⃣ Testing Products table...');
    const products = await prisma.product.findMany({
      include: {
        category: true
      }
    });
    console.log(`   ✅ Found ${products.length} products`);
    products.forEach(product => {
      console.log(`   🛒 ${product.name}`);
      console.log(`      Category: ${product.category.name}`);
      console.log(`      Price: ${product.price} MAD`);
      console.log(`      Stock: ${product.quantity} units`);
      console.log(`      Specs: ${product.specs.join(', ')}`);
    });
    console.log('');

    // Test 5: Admin
    console.log('5️⃣ Testing Admin table...');
    const admins = await prisma.admin.findMany({
      select: {
        email: true,
        name: true,
        role: true,
        active: true
      }
    });
    console.log(`   ✅ Found ${admins.length} admin user(s)`);
    admins.forEach(admin => {
      console.log(`   👤 ${admin.name} (${admin.email}) - Role: ${admin.role}`);
    });
    console.log('');

    // Test 6: Orders (should be empty initially)
    console.log('6️⃣ Testing Orders table...');
    const orders = await prisma.order.findMany();
    console.log(`   ✅ Found ${orders.length} orders (expected 0 initially)\n`);

    // Test 7: Create a test order
    console.log('7️⃣ Testing order creation...');
    const testProduct = products[0];
    if (testProduct) {
      const testOrder = await prisma.order.create({
        data: {
          orderNumber: `TEST-${Date.now()}`,
          customerName: 'Test Customer',
          phone: '0612345678',
          city: 'Casablanca',
          address: '123 Test Street',
          total: testProduct.price + 20, // Product price + shipping
          items: {
            create: {
              productId: testProduct.id,
              quantity: 1,
              price: testProduct.price
            }
          }
        },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });
      console.log(`   ✅ Created test order: ${testOrder.orderNumber}`);
      console.log(`   📦 Order details:`);
      console.log(`      Customer: ${testOrder.customerName}`);
      console.log(`      City: ${testOrder.city}`);
      console.log(`      Total: ${testOrder.total} MAD`);
      console.log(`      Status: ${testOrder.status}`);
      console.log(`      Items: ${testOrder.items.length}`);
      testOrder.items.forEach(item => {
        console.log(`        - ${item.product.name} x${item.quantity} = ${item.price} MAD`);
      });
      console.log('');

      // Test 8: Query the order back
      console.log('8️⃣ Testing order retrieval...');
      const retrievedOrder = await prisma.order.findUnique({
        where: { id: testOrder.id },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });
      console.log(`   ✅ Successfully retrieved order: ${retrievedOrder?.orderNumber}\n`);

      // Test 9: Update order status
      console.log('9️⃣ Testing order status update...');
      const updatedOrder = await prisma.order.update({
        where: { id: testOrder.id },
        data: { status: 'CONFIRMED' }
      });
      console.log(`   ✅ Updated order status to: ${updatedOrder.status}\n`);

      // Test 10: Delete test order
      console.log('🔟 Cleaning up test order...');
      await prisma.order.delete({
        where: { id: testOrder.id }
      });
      console.log(`   ✅ Test order deleted successfully\n`);
    }

    // Test 11: Database statistics
    console.log('📊 Database Statistics:');
    const stats = {
      categories: await prisma.category.count(),
      products: await prisma.product.count(),
      cities: await prisma.city.count(),
      admins: await prisma.admin.count(),
      orders: await prisma.order.count()
    };
    console.log(`   Categories: ${stats.categories}`);
    console.log(`   Products: ${stats.products}`);
    console.log(`   Cities: ${stats.cities}`);
    console.log(`   Admins: ${stats.admins}`);
    console.log(`   Orders: ${stats.orders}`);
    console.log('');

    console.log('✨ All database tests passed successfully! ✨');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
