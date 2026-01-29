import express from "express";
import { tutorController } from "./tutor.controller";

const router = express.Router();

router.post('/tutor', tutorController.createTutors)

router.get('/tutor', tutorController.getAllTutors)

router.get('/tutor/:id', tutorController.getTutorById)

router.put('/tutor/profile/:id', tutorController.updateTutor)

export const tutorRouter = router;