import { Request, Response } from "express";
import { Bookings } from "../../../generated/prisma";
import { prisma } from "../../lib/prisma.js";

const createBookings = async (data: Bookings) => {
    const result = await prisma.bookings.create({
        data
    })
    return result
}

const getAllBookings = async (data: Bookings) => {
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
            category: true
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
            category: true
        }
    })

    return result
}

export const bookingsService = {
    createBookings,
    getAllBookings,
    getBookingById
}