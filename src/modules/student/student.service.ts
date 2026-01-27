import { Users } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createStudent = async (data: Users) => {
    const result = await prisma.users.create({
        data,
    })
    return result;
}

const getAllStudent = async (data: Users) => {
    const result = await prisma.users.findMany({    
    //     where: {
    //   role: "STUDENT",
    // },
        include: {
            tutorProfiles: true,
            bookings: true,
            reviews: true
        }
    })
    return result;
}

export const studentService = {
    createStudent,
    getAllStudent
}