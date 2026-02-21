import { AvailabilityStatus, TutorAvailability } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";

interface CreateAvailabilityInput {
    tutorId: number;
    startTime: Date | string;
    endTime: Date | string;
    status?: AvailabilityStatus;
    bookingId?: number;
}

interface UpdateAvailabilityInput {
    startTime?: Date | string;
    endTime?: Date | string;
    status?: AvailabilityStatus;
    bookingId?: number;
}

const createTutorAvailability = async (data: CreateAvailabilityInput) => {
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);

    if (start >= end) {
        throw new Error("Start time must be before end time");
    }

    const overlappingSlot = await prisma.tutorAvailability.findFirst({
        where: {
            tutorId: data.tutorId,
            AND: [
                { startTime: { lt: end } },
                { endTime: { gt: start } }
            ]
        }
    });

    if (overlappingSlot) {
        throw new Error("Time slot overlaps with existing availability");
    }

    const result = await prisma.tutorAvailability.create({
        data: {
            tutorId: data.tutorId,
            startTime: start,
            endTime: end,
            status: data.status || AvailabilityStatus.AVAILABLE,
            booking: data.bookingId ? { connect: { id: data.bookingId } } : undefined
        }
    })
    return result
}

const updateAvailability = async (slotId: number, data: UpdateAvailabilityInput) => {
    const existingSlot = await prisma.tutorAvailability.findUnique({
        where: { id: slotId }
    })

    if (!existingSlot) {
        throw new Error("Slot not found")
    }

    if (data.bookingId && data.status !== AvailabilityStatus.BOOKED) {
        throw new Error("bookingId allowed only when status is BOOKED");
    }

    return await prisma.tutorAvailability.update({
        where: { id: slotId },
        data: {
            startTime: data.startTime ? new Date(data.startTime) : undefined,
            endTime: data.endTime ? new Date(data.endTime) : undefined,
            status: data.status ? data.status : undefined,
            booking: data.bookingId ? { connect: { id: data.bookingId } } : undefined
        }
    });
};

const getMyAvailability = async (tutorId: number) => {
    const result = await prisma.tutorAvailability.findMany({
        where: {tutorId},
        orderBy: {startTime: "asc"}
    })
    return result
}

const getTutorAvailability = async (tutorId: number) => {
    const result = await prisma.tutorAvailability.findMany({
        where: {
            tutorId,
            status: AvailabilityStatus.AVAILABLE 
        },
        orderBy: {startTime: "asc"}
    })
    return result
}

const deleteAvailability = async (slotId: number) => {
  const slot = await prisma.tutorAvailability.findUnique({
    where: {id: slotId}
  })

  if(!slot){
    throw new Error ("Slot not found")
  }

  if (slot.status === AvailabilityStatus.BOOKED){
    throw new Error ("Cannot deleted a booked slot")
  }

  return await prisma.tutorAvailability.delete({where: {id: slotId}})
}

export const tutorAvailabilityService = {
    createTutorAvailability,
    updateAvailability,
    getMyAvailability,
    getTutorAvailability,
    deleteAvailability
}