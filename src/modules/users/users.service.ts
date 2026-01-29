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
    // const { password, ...safeUser } = user;
    // return safeUser;
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

export const userService = {
    createUser,
    getAllUser
}