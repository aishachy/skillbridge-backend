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

const getUserById = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.id);
        const result = await userService.getUserById(userId)

        if (!result) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(result)
    } catch (e) {
        res.status(400).json({
            error: "User by id fetch failed",
            details: e
        })
    }
}


const updateUser = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.id);

        const result = await userService.updateUser(req.body, userId)
        res.status(200).json(result)
    } catch (e) {
        res.status(400).json({
            error: "user update failed",
            details: e
        })
    }
}

const deleteUser = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.id);
        const result = await userService.deleteUser(userId);
        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (err: any) {
        res.status(404).json({
            success: false,
            message: err.message
        });
    }
};

const getStats = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ success: false, message: "Unauthorized" });

        const stats = await userService.getStats(userId)

        res.status(200).json({ success: true, data: stats });
    } catch (e) {
        const errorMessage = (e instanceof Error) ? e.message : "Stats fetched failed!"
        res.status(400).json({
            error: errorMessage,
            details: e
        })
    }
}

const banUserController = async (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    try {
        const user = await userService.banUser(userId);
        res.json({ 
            success: true, 
            message: "User banned successfully",
            user });
    } catch (err) {
        res.status(400).json({ 
            success: false,
            message: "Error banning user", 
            error: err });
    }
};

const unbanUserController = async (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    try {
        const user = await userService.unbanUser(userId);
        res.json({ 
            success: true, 
            message: "User unbanned successfully", 
            user });
    } catch (err) {
        res.status(400).json({ 
            success: false, 
            message: "Error unbanning user", 
            error: err });
    }
};

export const UserController = {
    createUser,
    getAllUser,
    getUserById,
    updateUser,
    deleteUser,
    getStats,
    banUserController,
    unbanUserController
}