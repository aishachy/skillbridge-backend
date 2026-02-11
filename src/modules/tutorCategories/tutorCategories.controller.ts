import { Request, Response } from "express";
import { tutorCategoriesService } from "./tutorCategories.service";

const createTutorCategory = async (req: Request, res: Response) => {
  try {
    const result = await tutorCategoriesService.createTutorCategories({
      tutorId: Number(req.body.tutorId),
      categoryId: Number(req.body.categoryId),
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Tutor category creation failed",
    });
  }
};

const getAllCategories = async (req: Request, res: Response) => {
  try {
    const result = await tutorCategoriesService.getAllTutorCategories(req.body)
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      details: error
    })
  }
}

export const tutorCategoriesController = {
  createTutorCategory,
  getAllCategories
}