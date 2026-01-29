import express from "express"
import { UserController } from "./users.controller";
import auth from "../../middleware/auth";



const router = express.Router();

router.post('/', UserController.createUser)

router.get('/allUsers', auth("ADMIN"), UserController.getAllUser)

export const userRouter = router