import express from "express"
import { tutorAvailabilityController } from "./tutorAvailability.controller"
import auth from "../../middleware/auth"

const router = express.Router()

router.post('/', auth("TUTOR"), tutorAvailabilityController.createTutorAvailability)

router.put('/:id', tutorAvailabilityController.updateAvailability)

export const tutorAvailabilityRouter = router