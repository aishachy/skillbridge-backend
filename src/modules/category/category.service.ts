import { Categories } from "../../../generated/prisma";
import { prisma } from "../../lib/prisma";

const createCategory = async (data: Categories) => {
    const result = await prisma.categories.create({
        data
    })
    return result
}

const getAllCategories = async (data: Categories) => {
    const result = await prisma.categories.findMany({
        include: {
            tutors: true,
            bookings: true
        }
    })
    return result
}

export const categoryService = {
    createCategory,
    getAllCategories
}