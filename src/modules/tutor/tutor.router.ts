import express from "express";
import { tutorController } from "./tutor.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.post('/tutor', tutorController.createTutors)

router.get('/tutor', tutorController.getAllTutors)

router.get('/tutor/:id', tutorController.getTutorById)

router.put('/tutor/profile/:id', tutorController.updateTutor)

router.put('/tutor/profile', auth("TUTOR"), tutorController.updateTutorProfile)

export const tutorRouter = router;