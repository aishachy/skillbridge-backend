import { TutorAvailability } from "../../../generated/prisma";
import { prisma } from "../../lib/prisma";

const createTutorAvailability = async (data: TutorAvailability) => {
    const result = await prisma.tutorAvailability.create({
        data: {
            tutorId: data.tutorId,
            startTime: new Date(data.startTime),
            endTime: new Date(data.endTime),
            status: data.status,
            bookingId: data.bookingId
        }
    })
    return result
}

interface AvailabilityInput {
    startTime: Date | string;
    endTime: Date | string;
}


const updateAvailability = async (slotId: number, data: TutorAvailability) => {
    if (data.status !== "BOOKED" && data.bookingId !== null) {
        throw new Error("bookingId allowed only when status is BOOKED");
    }
    const result = await prisma.tutorAvailability.update({
        where: {
            id: slotId
        },
        data: {
            startTime: new Date(data.startTime),
            endTime: new Date(data.endTime),
            status: data.status,
            bookingId: data.bookingId
        }
    })
    return result
}

export const tutorAvailabilityService = {
    createTutorAvailability,
    updateAvailability
}