import express from "express";
import { authController } from "./auth.controller";

const router = express.Router()

router.post('/login', authController.loginUser)

router.post('/register', authController.registerUser)

router.get('/me', authController.currentUser)

export const authRouter = router;