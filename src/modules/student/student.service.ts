import { User } from "../../../generated/prisma";
import { prisma } from "../../lib/prisma";

const createStudent = async (data: User) => {
    const result = await prisma.user.create({
        data,
    })
    return result;
}

const getAllStudent = async (data: User) => {
    const result = await prisma.user.findMany({    
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