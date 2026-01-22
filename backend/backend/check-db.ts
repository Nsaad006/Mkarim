import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    const count = await prisma.product.count();
    console.log(`Total products: ${count}`);
    if (count > 0) {
      const products = await prisma.product.findMany({ take: 5 });
      console.log('First 5 products:', JSON.stringify(products, null, 2));
    }
  } catch (e) {
    console.error('Error connecting to database:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
