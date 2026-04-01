const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const products = await prisma.product.findMany();
    console.log('--- ALL PRODUCTS ---');
    products.forEach(p => {
      console.log(`ID: ${p.id} | Name: ${p.name} | Category: ${p.category} | Brand: ${p.brand}`);
    });
    console.log('--- TOTAL:', products.length, '---');
  } catch (err) {
    console.error('Error dumping products:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
