import { Users } from "../../../generated/prisma";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs"

const createUser = async (data: Users) => {
    if (!data.password) {
        throw new Error("Password is required");
    }
    const hashedPass = await bcrypt.hash(data.password, 10)
    const user = await prisma.users.create({
        data: {
            ...data,
            password: hashedPass,
        },
    })
    return user;
}

const getAllUser = async (data: Users) => {
    const result = await prisma.users.findMany({
        include: {
            tutorProfiles: true,
            bookings: true,
            reviews: true
        }
    })
    return result;
}

const getUserById = async (userId: number) => {
    const user = await prisma.users.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    if (!user) throw new Error("User not found");
    return user;
};


const updateUser = async (data: Users, userId: number) => {
    const result = await prisma.tutorProfiles.update({
        where: {
            id: userId
        },
        data
    })
    return result
}

 const deleteUser = async (userId: number) => {
    const user = await prisma.users.findUnique({ 
        where: { 
            id: userId 
        }
     });
    if (!user) throw new Error("User not found");

    const result = prisma.users.delete({
         where: { 
            id: userId 
        } 
    });
    return {result, message: "User deleted successfully" };
};


export const userService = {
    createUser,
    getAllUser,
    getUserById,
    updateUser,
    deleteUser
}