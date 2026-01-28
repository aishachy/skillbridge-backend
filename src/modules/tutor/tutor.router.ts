import express from "express";
import { tutorController } from "./tutor.controller";

const router = express.Router();

router.post('/tutors', tutorController.createTutors)

router.get('/tutors', tutorController.getAllTutors)

router.get('/tutors/:id', tutorController.getTutorById)

router.put('/tutors/profile/:id', tutorController.updateTutor)

export const tutorRouter = router;