// src/server.ts
import 'dotenv/config'; // <- this must be at the top
import app from './app.js';
import { prisma } from './lib/prisma.js'; // Prisma will now see process.env.DATABASE_URL

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
