import app from "./app.js";
import dotenv from "dotenv";
dotenv.config();
import { prisma } from "./lib/prisma.js";

const PORT = process.env.PORT || 5000;

export async function main() {
    try {
        await prisma.$connect();
        console.log("connected to the database successfully");

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        })
    } catch (error) {
        console.log("an error occured", error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

main()