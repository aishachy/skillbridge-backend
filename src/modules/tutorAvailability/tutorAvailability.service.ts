import { TutorAvailability } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";

interface CreateAvailabilityInput {
    tutorId: number;
    startTime: Date | string;
    endTime: Date | string;
    status?: "AVAILABLE" | "BOOKED" | "BLOCKED";
    bookingId?: number;
}

const createTutorAvailability = async (data: CreateAvailabilityInput) => {
    const result = await prisma.tutorAvailability.create({
        data: {
            tutorId: data.tutorId,
            startTime: new Date(data.startTime),
            endTime: new Date(data.endTime),
            status: data.status,
            booking: data.bookingId ? { connect: { id: data.bookingId } } : undefined
        }
    })
    return result
}

interface UpdateAvailabilityInput {
    startTime?: Date | string;
    endTime?: Date | string;
    status?: "AVAILABLE" | "BOOKED" | "BLOCKED";
    bookingId?: number; // optional
}


const updateAvailability = async (slotId: number, data: UpdateAvailabilityInput) => {
    if (data.bookingId && data.status !== "BOOKED") {
        throw new Error("bookingId allowed only when status is BOOKED");
    }

    return await prisma.tutorAvailability.update({
        where: { id: slotId },
        data: {
            startTime: data.startTime ? new Date(data.startTime) : undefined,
            endTime: data.endTime ? new Date(data.endTime) : undefined,
            status: data.status,
            booking: data.bookingId ? { connect: { id: data.bookingId } } : undefined
        }
    });
};

export const tutorAvailabilityService = {
    createTutorAvailability,
    updateAvailability
}