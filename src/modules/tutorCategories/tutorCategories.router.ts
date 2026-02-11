import express from "express"
import auth from "../../middleware/auth"
import { tutorCategoriesController } from "./tutorCategories.controller"

const router = express.Router()

router.post("/", auth("ADMIN"), tutorCategoriesController.createTutorCategory)

router.get("/", auth("ADMIN"), tutorCategoriesController.getAllCategories)

export const tutorCategoriesRouter = router