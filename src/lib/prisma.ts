// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client"; // Prisma 7+ client
import "dotenv/config";

export const prisma = new PrismaClient();
