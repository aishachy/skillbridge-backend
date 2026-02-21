import express from "express"
import { tutorAvailabilityController } from "./tutorAvailability.controller"
import auth from "../../middleware/auth"

const router = express.Router()

router.post('/', auth("TUTOR"), tutorAvailabilityController.createTutorAvailability)

router.put('/:id', auth("TUTOR"), tutorAvailabilityController.updateAvailability)

router.get("/tutor/:tutorId", auth("TUTOR"), tutorAvailabilityController.getMyAvailability)

router.get('/tutor/:tutorId/available', auth("TUTOR"), tutorAvailabilityController.getTutorAvailability)

router.delete('/:id', auth("TUTOR"), tutorAvailabilityController.deleteAvailability)


export const tutorAvailabilityRouter = router