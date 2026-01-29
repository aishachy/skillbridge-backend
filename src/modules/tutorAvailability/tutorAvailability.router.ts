import express from "express"
import { tutorAvailabilityController } from "./tutorAvailability.controller"
import auth from "../../middleware/auth"

const router = express.Router()

router.post('/tutor/availability', auth("TUTOR"), tutorAvailabilityController.createTutorAvailability)

router.put('/tutor/availability/:id', tutorAvailabilityController.updateAvailability)

export const tutorAvailabilityRouter = router