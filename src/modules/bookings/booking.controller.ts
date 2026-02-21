import { Request, Response } from "express";
import { bookingsService } from "./bookings.service";

const createBookings = async (req: Request, res: Response) => {
    try {
        const result = await bookingsService.createBookings(req.body)
        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: result
        })
    } catch (e) {
        res.status(400).json({
            error: 'booking creation failed',
            details: e
        })
    }
}

const getAllBookings = async (req: Request, res: Response) => {
    try {
        const result = await bookingsService.getAllBookings()
        res.status(201).json(result)
    } catch (e) {
        res.status(400).json({
            error: 'booking fetch failed',
            details: e
        })
    }
}

const getStudentBookings = async (req: Request, res: Response) => {
    try {
        const studentId = Number(req.params.studentId);

        const bookings = await bookingsService.getStudentBookings(studentId);

        res.status(200).json({
            success: true,
            data: bookings,
        });

    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};


const getTutorBookings = async (req: Request, res: Response) => {
    try {
        const tutorId = Number(req.params.tutorId);

        const bookings = await bookingsService.getTutorBookings(tutorId);

        res.status(200).json({
            success: true,
            data: bookings,
        });

    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};


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

const updateBooking = async (req: Request, res: Response) => {
    try {
        const bookingId = Number(req.params.id);
        const { status } = req.body;

        const updatedBooking = await bookingsService.updateBooking(
            bookingId,
            status
        );

        res.status(200).json({
            success: true,
            message: "Booking status updated",
            data: updatedBooking,
        });

    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};


const cancelBooking = async (req: Request, res: Response) => {
    try {
        const bookingId = Number(req.params.id);

        const result = await bookingsService.cancelBooking(bookingId);

        res.status(200).json({
            success: true,
            message: result.message,
        });

    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};


export const bookingController = {
    createBookings,
    getAllBookings,
    getBookingById,
    getStudentBookings,
    getTutorBookings,
    updateBooking,
    cancelBooking
}