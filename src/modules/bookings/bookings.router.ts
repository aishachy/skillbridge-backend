import express from "express"
import { bookingController } from "./booking.controller"
import auth from "../../middleware/auth"

const router = express.Router()

router.post('/bookings', auth(), bookingController.createBookings)

router.get('/bookings', auth("ADMIN"), bookingController.getAllBookings)

router.get('/bookings/:id', bookingController.getBookingById)

router.get('/student/:studentId', bookingController.getStudentBookings)

router.get('/tutor/:tutorId', bookingController.getTutorBookings)

router.get('/tutor/bookings', auth("TUTOR"), bookingController.getTutorBookings)

router.put('/tutor/bookings/:id/status', auth("TUTOR"), bookingController.updateBooking)

router.put('/status/:id', bookingController.updateBooking)

router.put('/cancel/:id', bookingController.cancelBooking)

export const bookingRouter = router