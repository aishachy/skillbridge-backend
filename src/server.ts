import 'dotenv/config';
import app from './app';
import { prisma } from './lib/prisma'; 

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received: closing Prisma connection');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received: closing Prisma connection');
  await prisma.$disconnect();
  process.exit(0);
});
