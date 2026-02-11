import express from "express";
import { tutorController } from "./tutor.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.get('/tutor', tutorController.getAllTutors)

router.get('/tutor/dashboard', auth("TUTOR", "ADMIN"), tutorController.getStats)

router.get('/tutor/:id', tutorController.getTutorById)

router.post('/tutor', tutorController.createTutors)

router.put('/tutor/profile/:id', tutorController.updateTutor)

router.put('/tutor/profile', auth("TUTOR"), tutorController.updateTutorProfile)

export const tutorRouter = router;