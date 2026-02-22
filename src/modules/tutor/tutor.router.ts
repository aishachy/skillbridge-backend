import express from "express";
import { tutorController } from "./tutor.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.get('/tutor', tutorController.getAllTutors)

router.get('/tutor/dashboard', auth("TUTOR", "ADMIN"), tutorController.getStats)

router.get('/tutor/:id', tutorController.getTutorById)

router.post('/tutor', auth("TUTOR", "ADMIN"), tutorController.createTutors)

router.put('/tutor/profile/:id', auth("TUTOR", "ADMIN"), tutorController.updateTutor)

router.put('/tutor/profile', auth("TUTOR"), tutorController.updateTutorProfile)

router.delete('/tutor/:id', tutorController.deleteTutor)

export const tutorRouter = router;