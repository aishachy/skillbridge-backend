import { Request, Response } from "express";
import { reviewsService } from "./reviews.service";

const createReviews = async (req: Request, res: Response) => {
    try{
        const result = await reviewsService.createReviews(req.body)
        res.status(201).json(result)
    } catch(e){
        res.status(400).json({
            error: "review creation failed",
            details: e
        })
    }

}

export const reviewsController = {
    createReviews
}