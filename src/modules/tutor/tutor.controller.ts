import { Request, Response } from "express"
import { tutorService } from "./tutor.service"
import { prisma } from "../../lib/prisma"


const createTutors = async (req: Request, res: Response) => {
    try {
        const result = await tutorService.createTutor(req.body)
        res.status(201).json(result)
    } catch (e) {
        res.status(400).json({
            error: "tutor creation failed",
            details: e
        })
    }
}

const getAllTutors = async (req: Request, res: Response) => {
    try {
        const { search } = req.query
        const searchString = typeof search === 'string' ? search : undefined
        const isFeatured = req.query.isFeatured
            ? req.query.isFeatured === 'true'
                ? true
                : req.query.isFeatured === 'false'
                    ? false
                    : undefined
            : undefined

        const result = await tutorService.getAllTutors({ search: searchString, isFeatured })
        res.status(200).json({
            success: true,
            data: result
        })
    } catch (error) {
        console.error("error:", error);
        res.status(400).json({
            success: false,
            error: "tutors fetch failed",
            details: error
        })
    }
}

const getTutorById = async (req: Request, res: Response) => {
    try {
        const tutorId = Number(req.params.id);
        const result = await tutorService.getTutorById(tutorId!)

        if (!result) {
            return res.status(404).json({ error: "Tutor not found" });
        }
        res.status(200).json(result)
    } catch (e) {
        res.status(400).json({
            error: "tutors by id fetch failed",
            details: e
        })
    }
}

const updateTutor = async (req: Request, res: Response) => {
    try {
        const tutorId = Number(req.params.id);
        const result = await tutorService.updateTutor(tutorId)
        res.status(200).json(result)
    } catch (e) {
        res.status(400).json({
            error: "tutor update failed",
            details: e
        })
    }
}

const updateTutorProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const result = await tutorService.updateTutorProfile(userId, req.body);
        res.status(200).json({
            success: true,
            message: "Tutor profile updated successfully",
            data: result
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: "Profile update failed",
            error: err.message
        });
    }

};


const getStats = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }
        const tutorProfile = await prisma.tutorProfiles.findUnique({
            where: { userId },
            include: {
                user: true
            }
        });

        if (!tutorProfile) {
            return res.status(404).json({ message: "Tutor profile not found" });
        }
        const tutorName = tutorProfile.user.name;
        const stats = await tutorService.getStats(tutorProfile.id)

        res.status(200).json({
            success: true, data: {
                tutorName,
                ...stats
            }
        });
    } catch (err: any) {
        res.status(400).json({ success: false, message: "Stats fetch failed", error: err.message });
    }
};



export const tutorController = {
    createTutors,
    getAllTutors,
    getTutorById,
    updateTutor,
    updateTutorProfile,
    getStats
}