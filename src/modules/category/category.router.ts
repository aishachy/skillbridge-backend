import express from "express"
import { categoryController } from "./category.controller"
import auth from "../../middleware/auth"

const router = express.Router()

router.get('/', auth("ADMIN"), categoryController.getAllCategories)

router.get('/:id', auth("ADMIN"), categoryController.getCategoriesById)

router.post('/', auth("ADMIN"), categoryController.createCategory)

router.put('/:id', auth("ADMIN"), categoryController.updateCategory)

router.delete('/:id', auth("ADMIN"), categoryController.deleteCategory)

export const categoryRouter = router