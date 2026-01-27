import express from "express"
import { categoryController } from "./category.controller"

const router = express.Router()

router.post('/', categoryController.createCategory)

router.get('/categories', categoryController.getAllCategories)

export const categoryRouter = router