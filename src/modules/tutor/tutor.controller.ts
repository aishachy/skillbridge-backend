import { Request, Response } from "express"
import { tutorService } from "./tutor.service"

const createTutors = async (req: Request, res: Response) => {
    try {
        const result = await tutorService.createTutor(req.body)
        res.status(201).json(result)
    } catch (e) {
        res.status(400).json({
            error: "tutor creation failed",
            details: e
        })
    }
}

const getAllTutors = async (req: Request, res: Response) => {
    try {
        const result = await tutorService.getAllTutors(req.body)
        res.status(201).json(result)
    } catch (e) {
        res.status(400).json({
            error: "tutors fetch failed",
            details: e
        })
    }
}

const getTutorById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        if (!id || Array.isArray(id)) {
            return res.status(400).json({ error: "Invalid tutor ID" });
        }
        const tutorId = parseInt(id);
        const result = await tutorService.getTutorById(tutorId!)

        if (!result) {
            return res.status(404).json({ error: "Tutor not found" });
        }
        res.status(200).json(result)
    } catch (e) {
        res.status(400).json({
            error: "tutors by id fetch failed",
            details: e
        })
    }
}

const updateTutor = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({ error: "Invalid tutor ID" });
        }
        const tutorId = parseInt(id);

        const result = await tutorService.updateTutor(req.body, tutorId)
        res.status(200).json(result)
    } catch (e) {
        res.status(400).json({
            error: "tutor update failed",
            details: e
        })
    }
}


export const tutorController = {
    createTutors,
    getAllTutors,
    getTutorById,
    updateTutor
}