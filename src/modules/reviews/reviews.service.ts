import { prisma } from "../../lib/prisma.js";

interface CreateReviewInput {
    bookingId: number;
    studentId: number;
    rating: string;
    comment?: string;
}

const createReviews = async (data: CreateReviewInput) => {
    const { bookingId, studentId, rating, comment } = data;

    const booking = await prisma.bookings.findUnique({
        where: { id: bookingId },
    });

    if (!booking) {
        throw new Error("Booking not found");
    }
    if (booking.studentId !== studentId) {
        throw new Error("You can only review your own sessions");
    }
    if (booking.status !== "COMPLETED") {
        throw new Error("You can only review completed sessions");
    }

    const review = await prisma.reviews.create({
        data: {
            bookingId,
            studentId,
            tutorId: booking.tutorId,
            rating,
            ...(comment !== undefined && { comment }),
        }
    })

    return review
}
export const reviewsService = {
    createReviews
}