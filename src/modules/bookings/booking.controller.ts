import { Request, Response } from "express";
import { bookingsService } from "./bookings.service";

const createBookings = async (req: Request, res: Response) => {
    try {
        const result = await bookingsService.createBookings(req.body)
        res.status(201).json(result)
    } catch (e) {
        res.status(400).json({
            error: 'booking creation failed',
            details: e
        })
    }
}

const getAllBookings = async (req: Request, res: Response) => {
    try {
        const result = await bookingsService.getAllBookings(req.body)
        res.status(201).json(result)
    } catch (e) {
        res.status(400).json({
            error: 'booking fetch failed',
            details: e
        })
    }
}

const getBookingById = async (req: Request, res: Response) => {
    try {
        const bookingId = Number(req.params.id);
        const result = await bookingsService.getBookingById(bookingId)

        if (!result) {
            return res.status(404).json({
                error: "Booking not found"
            })
        }
        res.status(200).json(result)
    } catch (e) {
        res.status(400).json({
            error: "bookings by id fetch failed",
            details: e
        })
    }
}

export const bookingController = {
    createBookings,
    getAllBookings,
    getBookingById
}