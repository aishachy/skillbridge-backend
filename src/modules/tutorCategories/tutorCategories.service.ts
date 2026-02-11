import { Categories, TutorProfiles } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma.js";

interface tutorCategories {
    tutor: TutorProfiles,
    category: Categories
}

interface CreateTutorCategoryInput {
  tutorId: number;
  categoryId: number;
}

const createTutorCategories = async (data: CreateTutorCategoryInput) => {

    const result = await prisma.tutorCategories.create({
        data: {
            tutorId: data.tutorId,
            categoryId: data.categoryId
        },
    });

    return result;
};


const getAllTutorCategories = async (data: tutorCategories) => {
    const result = await prisma.tutorCategories.findMany({
        include: {
            tutor: true,
            category: true
        }
    })
    return result
}

export const tutorCategoriesService = {
    createTutorCategories,
    getAllTutorCategories
}