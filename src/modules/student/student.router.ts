import express from "express"
import { studentController } from "./student.controller";

const router = express.Router();

router.post('/', studentController.createStudent)

router.get('/allStudent', studentController.getAllStudent)

export const studentRouter = router