const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log(`✅ Admin user created: ${admin.username}`);

  // Create default room types
  const roomTypes = [
    { name: 'Standard', basePrice: 1500, maxOccupancy: 2 },
    { name: 'Deluxe', basePrice: 2500, maxOccupancy: 3 },
    { name: 'Suite', basePrice: 4000, maxOccupancy: 4 },
  ];

  for (const type of roomTypes) {
    await prisma.roomType.upsert({
      where: { name: type.name },
      update: {},
      create: type,
    });
  }

  console.log(`✅ Room types created: ${roomTypes.map(t => t.name).join(', ')}`);
  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

