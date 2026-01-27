import express from "express"
import { bookingController } from "./booking.controller"

const router = express.Router()

router.post('/bookings', bookingController.createBookings)

router.get('/bookings', bookingController.getAllBookings)

router.get('/bookings/:id', bookingController.getBookingById)

export const bookingRouter = router