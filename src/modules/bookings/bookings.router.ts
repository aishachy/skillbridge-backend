import express from "express"
import { bookingController } from "./booking.controller"
import auth from "../../middleware/auth"

const router = express.Router()

router.post('/bookings', bookingController.createBookings)

router.get('/bookings', auth("ADMIN"), bookingController.getAllBookings)

router.get('/bookings/:id', bookingController.getBookingById)

export const bookingRouter = router