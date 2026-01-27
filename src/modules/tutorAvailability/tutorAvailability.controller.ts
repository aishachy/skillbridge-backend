import { Request, Response } from "express";
import { tutorAvailabilityService } from "./tutorAvailability.service";

const createTutorAvailability = async (req: Request, res: Response) => {
    try {
        const result = await tutorAvailabilityService.createTutorAvailability(req.body);
        res.status(201).json(result);
    } catch (e) {
        res.status(400).json({
            error: "availability creation failed",
            details: e
        });
    }

}

const updateAvailability = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        if(!id || Array.isArray(id)){
            return res.status(400).json({
                error: "invalid tutor id"
            })
        }

        const slotId = parseInt(id)
        const result = await tutorAvailabilityService.updateAvailability(
            slotId, req.body);
        res.status(200).json(result);
    } catch (e) {
        res.status(400).json({ error: "availability update failed", details: e });
    }
}

export const tutorAvailabilityController = {
    createTutorAvailability,
    updateAvailability
}