import express from "express"
import { UserController } from "./users.controller";
import auth from "../../middleware/auth";



const router = express.Router();

router.post('/users', UserController.createUser)

router.get('/', auth("ADMIN"), UserController.getStats)

router.get('/users', auth("ADMIN"), UserController.getAllUser)

router.get('/users/:id', auth("ADMIN"), UserController.getUserById)

router.put('/users/:id', auth("ADMIN"), UserController.updateUser)

router.put('/users/ban/:id', auth("ADMIN"), UserController.banUserController)

router.put('/users/unban/:id', auth("ADMIN"), UserController.unbanUserController)

router.delete('/users/:id', auth("ADMIN"), UserController.deleteUser)

export const userRouter = router