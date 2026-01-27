import express from "express"
import { tutorAvailabilityController } from "./tutorAvailability.controller"

const router = express.Router()

router.post('/tutors/availability', tutorAvailabilityController.createTutorAvailability)

router.put('/tutors/availability/:id', tutorAvailabilityController.updateAvailability)

export const tutorAvailabilityRouter = router