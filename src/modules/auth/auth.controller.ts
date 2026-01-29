import { Request, Response } from "express";
import { authService } from "./auth.service";

const loginUser = async (req: Request, res: Response) => {
    try {
        const result = await authService.loginUser(req.body)
        res.status(201).json(result)
    } catch (e) {
        res.status(400).json({
            error: "login failed",
            details: e
        })
    }
}

const registerUser = async (req: Request, res: Response) => {
    try {
        const {name, email, password, role} = req.body 
        const result = await authService.registerUser({name, email, password, role})
        res.status(201).json(result)
    } catch (e) {
        res.status(400).json({
            error: "registration failed",
            details: e
        })
    }
}

const currentUser = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(404).json({
                success: false,
                message: "Unauthorized"
            });
        }
        const user = await authService.currentUser(req.user.email);
        return res.status(200).json({
            success: true,
            user,
        });
    } catch (e: any) {
        return res.status(400).json({
            error: "failed to fetch user",
            details: e.message
        })
    }
}

export const authController = {
    loginUser,
    registerUser,
    currentUser
}