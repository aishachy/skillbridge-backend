import express, { NextFunction, Request, Response } from "express"
import { categoryController } from "./category.controller"
import { auth as betterAuth } from '../../lib/auth'

const router = express.Router()

export enum UserRole {
    STUDENT = "STUDENT",
    TUTOR = "TUTOR",
    ADMIN = "ADMIN"
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                name: string;
                role: string;
                emailVerified: boolean;
            }
        }
    }
}

const auth = (...roles: UserRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const session = await betterAuth.api.getSession({
            headers: req.headers as any
        })

        if (!session) {
            return res.status(401).json({
                success: false,
                message: 'you are not authorized'
            })
        }

        if (!session.user.emailVerified) {
            return res.status(401).json({
                success: false,
                message: 'Email verification required'
            })
        }

        req.user = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
            role: session.user.role as string,
            emailVerified: session.user.emailVerified
        }

        if (roles.length && !roles.includes(req.user.role as UserRole)) {
            return res.status(403).json({
                success: false,
                message: 'Forbidden!'
            })
        }

        next()
    }
}

router.post('/categories', auth(UserRole.STUDENT), categoryController.createCategory)

router.get('/categories', categoryController.getAllCategories)

export const categoryRouter = router