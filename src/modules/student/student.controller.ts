import { Request, Response } from "express";
import { studentService } from "./student.service";

const createStudent = async (req:Request, res:Response) => {
    try{
        const result = await studentService.createStudent(req.body)
        res.status(201).json(result)
    }catch(e){
        res.status(400).json({
            error: 'student creation failed',
            details: e
        })
    }
}

const getAllStudent = async (req:Request, res:Response) => {
    try{
        const result = await studentService.getAllStudent(req.body)
        res.status(201).json(result)
    }catch(e){
        res.status(400).json({
            error: 'student retrievtion failed',
            details: e
        })
    }
}

export const studentController = {
    createStudent,
    getAllStudent
}