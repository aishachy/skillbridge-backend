import express, { NextFunction, Request, Response } from "express"
import { studentController } from "./student.controller";

const router = express.Router();

const auth=() => {
    return async (req: Request, res: Response, next: NextFunction) => {
        console.log("middleware");
        next()
    }
}

router.post('/', auth(), studentController.createStudent)

router.get('/allStudent', studentController.getAllStudent)

export const studentRouter = router