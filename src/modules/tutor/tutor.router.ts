import express from "express";
import { tutorController } from "./tutor.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.get('/tutor', auth("ADMIN", "TUTOR"), tutorController.getAllTutors)

router.get('/tutor/:id', auth("ADMIN", "TUTOR"), tutorController.getTutorById)

router.get('/tutor/dashboard', auth("TUTOR"), tutorController.getStats)

router.post('/tutor', auth("TUTOR"), tutorController.createTutors)

router.put('/tutor/profile/:id', tutorController.updateTutor)

router.put('/tutor/profile', auth("TUTOR"), tutorController.updateTutorProfile)

export const tutorRouter = router;