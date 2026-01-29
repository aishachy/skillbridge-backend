import express from "express"
import { UserController } from "./users.controller";
import auth from "../../middleware/auth";



const router = express.Router();

router.post('/', UserController.createUser)

router.get('/admin/users', auth("ADMIN"), UserController.getAllUser)

router.put('/admin/users/:id', auth("ADMIN"), UserController.updateUser)

export const userRouter = router