import { Request, Response } from "express";
import { Bookings } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";

interface BookTutorInput {
    categoryId: any;
    tutorId: number;
    studentId: number;
    availabilityId: number;
    price: number;
}

interface BookingInput {
    tutorId: number;
    studentId: number;
    categoryId: number;
    startTime: Date;
    endTime: Date;
    price?: number;
    status?: "PENDING" | "CONFIRMED" | "CANCELLED";
    availabilityId: number;
}

const createBookings = async (data: BookingInput) => {
    const result = await prisma.bookings.create({
        data,
        include: {
            student: true,
            tutor: true,
            category: true,
            availability: true
        }
    })
    return result
}

const getAllBookings = async () => {
    const result = await prisma.bookings.findMany({
        include: {
            student: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    isBanned: true,
                }
            },
            tutor: true,
            category: true,
            availability: true
        }
    })
    return result
}

const getBookingById = async (id: number) => {
    const result = await prisma.bookings.findUnique({
        where: { id },
        include: {
            student: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    isBanned: true,
                }
            },
            tutor: true,
            category: true,
            availability: true
        }
    })

    return result
}

const bookTutorSlot = async (data: BookTutorInput) => {

    const slot = await prisma.tutorAvailability.findUnique({
        where: { id: data.availabilityId },
    });

    if (!slot) throw new Error("Availability slot not found");
    if (!slot || slot.status !== "AVAILABLE") {
        throw new Error("This slot is not available");
    }

    const booking = await prisma.bookings.create({
        data: {
            tutorId: data.tutorId,
            studentId: data.studentId,
            categoryId: data.categoryId,
            startTime: slot.startTime,
            endTime: slot.endTime,
            price: data.price,
            status: "CONFIRMED",
            availabilityId: slot.id,
        },
        include: {
            student: true,
            tutor: true,
            availability: true,
            category: true
        },
    });

    await prisma.tutorAvailability.update({
        where: { id: slot.id },
        data: {
            status: "BOOKED",
            booking: { connect: { id: booking.id } },
        },
    });

    return booking;
};

const getStudentBookings = async (studentId: number) => {
    const result = await prisma.bookings.findMany({
        where: { studentId },
        include: {
            tutor: true,
            category: true,
            availability: true,
        },
        orderBy: {
            createdAt: "desc"
        }
    })
    return result
}

const getTutorBookings = async (tutorId: number) => {
    const result = await prisma.bookings.findMany({
        where: {
            tutorId
        },
        include: {
            student: true,
            category: true,
            availability: true
        },
        orderBy: { createdAt: "desc" }
    })
    return result
}

const updateBooking = async (bookingId: number,
    status: "CONFIRMED" | "COMPLETED" | 'CANCELLED'
) => {
    const result = await prisma.bookings.findUnique({
        where: { id: bookingId }
    })
    if (!result) {
        throw new Error('Booking not found')
    }
    return await prisma.bookings.update({
        where: { id: bookingId },
        data: { status }
    })
}

const cancelBooking = async (bookingId: number) => {
    const result = await prisma.bookings.findUnique({
        where: { id: bookingId },
        include: { availability: true },
    });

    if (!result) {
        throw new Error("Booking not found");
    }

    await prisma.bookings.update({
        where: { id: bookingId },
        data: { status: "CANCELLED" },
    });

    if (result.availabilityId) {
        await prisma.tutorAvailability.update({
            where: { id: result.availabilityId },
            data: {
                status: "AVAILABLE",
                booking: { disconnect: true },
            },
        });
    }

    return { message: "Booking cancelled successfully" };
};



export const bookingsService = {
    createBookings,
    getAllBookings,
    getBookingById,
    bookTutorSlot,
    getStudentBookings,
    getTutorBookings,
    updateBooking,
    cancelBooking
}