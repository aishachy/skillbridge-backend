import { Reviews } from "../../../generated/prisma";
import { prisma } from "../../lib/prisma";

const createReviews = async (data: Reviews) => {
    const result = await prisma.reviews.create({
        data
    })
    return result
}

export const reviewsService = {
    createReviews
}