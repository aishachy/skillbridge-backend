// "use strict";
// Object.defineProperty(exports, "__esModule", { value: true });
// exports.prisma = void 0;
// require("dotenv/config");
// var client_1 = require("../generated/prisma/client");
// var connectionString = "".concat(process.env.DATABASE_URL);
// var adapter = new adapter_pg_1.PrismaPg({ connectionString: connectionString });
// var prisma = new client_1.PrismaClient({ adapter: adapter });
// exports.prisma = prisma;

import "dotenv/config";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
