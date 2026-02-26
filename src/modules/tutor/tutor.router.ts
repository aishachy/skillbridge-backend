import express from "express";
import { tutorController } from "./tutor.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.get('/', tutorController.getAllTutors)

router.get('/dashboard', auth("TUTOR", "ADMIN"), tutorController.getStats)

router.get('/:id', tutorController.getTutorById)

router.post('/', auth("TUTOR", "ADMIN"), tutorController.createTutors)

router.put('/profile/:id', auth("TUTOR", "ADMIN"), tutorController.updateTutor)

router.put('/profile', auth("TUTOR"), tutorController.updateTutorProfile)

router.delete('/:id', auth("ADMIN", "TUTOR"), tutorController.deleteTutor)

export const tutorRouter = router;