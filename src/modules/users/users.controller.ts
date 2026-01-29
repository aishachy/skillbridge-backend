import { Request, Response } from "express";
import { userService } from "./users.service";

const createUser = async (req: Request, res: Response) => {
    try {
        const result = await userService.createUser(req.body)
        res.status(201).json(result)
    } catch (e) {
        res.status(400).json({
            error: 'student creation failed',
            details: e
        })
    }
}

const getAllUser = async (req: Request, res: Response) => {
    try {
        const result = await userService.getAllUser(req.body)
        res.status(201).json(result)
    } catch (e) {
        res.status(400).json({
            error: 'student retrievtion failed',
            details: e
        })
    }
}

const updateUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        const tutorId = parseInt(id);

        const result = await userService.updateUser(req.body, tutorId)
        res.status(200).json(result)
    } catch (e) {
        res.status(400).json({
            error: "user update failed",
            details: e
        })
    }
}

export const UserController = {
    createUser,
    getAllUser,
    updateUser
}