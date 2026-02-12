// src/server.ts
import 'dotenv/config'; // Load environment variables first
import app from './app.js'; // make sure app.js is compiled to dist
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Optional: graceful shutdown
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
