import express from "express"
import { reviewsController } from "./reviews.controller"

const router = express.Router()

router.post('/reviews', reviewsController.createReviews)

export const reviewsRouter = router