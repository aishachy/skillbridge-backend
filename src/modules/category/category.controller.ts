import { Request, Response } from "express";
import { categoryService } from "./category.service";

const createCategory = async (req: Request, res: Response) => {
    try {
        const result = await categoryService.createCategory(req.body)
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
            error: 'category retrievtion failed',
            details: e
        })
    }
}


const getCategoriesById = async (req: Request, res: Response) => {
    try {
        const categoryId = Number(req.params.id);
        const result = await categoryService.getCategoriesById(categoryId)
        if (!result) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.status(200).json(result)
    } catch (e) {
        res.status(400).json({
            error: "Category by id fetch failed",
            details: e
        })
    }
}


const updateCategory = async (req: Request, res: Response) => {
    try {
        const categoryId = Number(req.params.id);

        const result = await categoryService.updateCategory(req.body, categoryId)
        res.status(200).json(result)
    } catch (e) {
        res.status(400).json({
            error: "Category update failed",
            details: e
        })
    }
}

const deleteCategory = async (req: Request, res: Response) => {
    try {
        const categoryId = Number(req.params.id);
        const result = await categoryService.deleteCategory(categoryId)
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

export const categoryController = {
    createCategory,
    getAllCategories,
    getCategoriesById,
    updateCategory,
    deleteCategory
}