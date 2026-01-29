import express from "express"
import { tutorAvailabilityController } from "./tutorAvailability.controller"

const router = express.Router()

router.post('/tutor/availability', tutorAvailabilityController.createTutorAvailability)

router.put('/tutor/availability/:id', tutorAvailabilityController.updateAvailability)

export const tutorAvailabilityRouter = router