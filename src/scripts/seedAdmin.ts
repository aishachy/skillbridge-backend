import { prisma } from "../lib/prisma.js"

async function seedAdmin() {
    try{
        const adminData = {
            name: "Admin Saheb",
            email: "admin@gmail.com",
            role: "ADMIN",
            password: "admin12345",
            phone: "01234544321"
        }
        const existingUser = await prisma.users.findUnique({
            where: {
                email: adminData.email
            }
        });

        if(existingUser){
            throw new Error ("User already exists!!")
        }

        const registerAdmin = await fetch("http://localhost:5000/api/auth/register", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(adminData)
        })

        console.log(registerAdmin);

    } catch(error){
        console.error(error)
    }
}

seedAdmin()