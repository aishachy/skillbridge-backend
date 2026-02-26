import express from "express"
import { studentController } from "./student.controller";
import auth from "../../middleware/auth";

const router = express.Router()

router.get('/bookings', auth("STUDENT"), studentController.studentBookings)

router.get('/', auth("STUDENT"), studentController.getStats)

router.get("/profile", auth("STUDENT"), studentController.getProfile);

router.put('/profile', auth("STUDENT"), studentController.updateProfile)

export const studentRouter = router;