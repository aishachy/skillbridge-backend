import { Categories, PrismaClient } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";

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

const getCategoriesById = async (categoryId: number) => {
    const result = await prisma.categories.findUnique({
        where: { id: categoryId },
        select: {
            id: true,
            subjectName: true,
            description: true,
            tutors: true,
            bookings: true
        },
    });

    if (!result) throw new Error("Category not found");
    return result;
};


const updateCategory = async (data: Categories, categoryId: number) => {
    const result = await prisma.categories.update({
        where: {
            id: categoryId
        },
        data
    })
    return result
}

const deleteCategory = async (categoryId: number) => {
    const category = await prisma.categories.findUnique({
        where: {
            id: categoryId
        }
    });
    if (!category) throw new Error("Category not found");

    const result = prisma.categories.delete({
        where: {
            id: categoryId
        }
    });
    return { result, message: "Category deleted successfully" };
};

export const categoryService = {
    createCategory,
    getAllCategories,
    getCategoriesById,
    updateCategory,
    deleteCategory
}