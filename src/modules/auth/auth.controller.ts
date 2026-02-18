import { Request, Response } from "express";
import { authService } from "./auth.service";
import { prisma } from "../../lib/prisma.js";

const loginUser = async (req: Request, res: Response) => {
    try {
        const { token, user } = await authService.loginUser(req.body)
        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            message: "Logged in successfully",
            token,
            user
        });
    } catch (e: any) {
        return res.status(e.statusCode || 401).json({
            success: false,
            message: e.message || "Login failed",
        });
    }
}

const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;

        const { token, user } = await authService.registerUser({
            name,
            email,
            password,
            role,
        });

        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(201).json({
            success: true,
            message: "Registered successfully",
            token,
            user,
        });
    } catch (e: any) {
        return res.status(400).json({
            success: false,
            message: "Registration failed",
            details: e.message,
        });
    }
};

const currentUser = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        console.log(userId);

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const user = await prisma.users.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        if (!user) throw new Error("User not found");

        return res.status(200).json({ success: true, user });
    } catch (err: any) {
        return res.status(400).json({ success: false, error: err.message });
    }
};


export const authController = {
    loginUser,
    registerUser,
    currentUser
}