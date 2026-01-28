import { Request, Response } from "express";
import { categoryService } from "./category.service";

const createCategory = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if(!user){
            return res.status(400).json({
                error: "Unauthorized",
            })
        }
        const result = await categoryService.createCategory(req.body, user.id as string)
        res.status(201).json(result)
    } catch (e) {
        res.status(400).json({
            error: 'category creation failed',
            details: e
        })
    }
}

const getAllCategories = async (req: Request, res: Response) => {
    try {
        const result = await categoryService.getAllCategories(req.body)
        res.status(201).json(result)
    } catch (e) {
        res.status(400).json({
            error: 'student retrievtion failed',
            details: e
        })
    }
}

export const categoryController = {
    createCategory,
    getAllCategories
}