import { Request, Response } from "express";
import { userService } from "./users.service";

const createUser = async (req:Request, res:Response) => {
    try{
        const result = await userService.createUser(req.body)
        res.status(201).json(result)
    }catch(e){
        res.status(400).json({
            error: 'student creation failed',
            details: e
        })
    }
}

const getAllUser = async (req:Request, res:Response) => {
    try{
        const result = await userService.getAllUser(req.body)
        res.status(201).json(result)
    }catch(e){
        res.status(400).json({
            error: 'student retrievtion failed',
            details: e
        })
    }
}

export const UserController = {
    createUser,
    getAllUser
}