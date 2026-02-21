import { Request, Response } from "express";
import { tutorAvailabilityService } from "./tutorAvailability.service";

const createTutorAvailability = async (req: Request, res: Response) => {
    try {
        const { tutorId, startTime, endTime, status, bookingId } = req.body

        const result = await tutorAvailabilityService.createTutorAvailability({
            tutorId,
            startTime,
            endTime,
            status,
            bookingId
        });
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
        const slotId = Number(req.params.id);
        const { startTime, endTime, status, bookingId } = req.body;

        const result = await tutorAvailabilityService.updateAvailability(
            slotId, {
                startTime,
                endTime,
                status,
                bookingId
            });
        res.status(200).json(result);
    } catch (e) {
        res.status(400).json({ error: "availability update failed", details: e });
    }
}

const getMyAvailability = async (req: Request, res: Response) => {
    try {
        const tutorId = Number(req.params.tutorId);

        const result = await tutorAvailabilityService.getMyAvailability(tutorId);

        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

const getTutorAvailability = async (req: Request, res: Response) => {
    try {
        const tutorId = Number(req.params.tutorId);

        const result = await tutorAvailabilityService.getTutorAvailability(tutorId);

        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

const deleteAvailability = async (req: Request, res: Response) => {
    try {
        const result = Number(req.params.id);

        const deletedSlot = await tutorAvailabilityService.deleteAvailability(result);

        res.status(200).json({ message: "Slot deleted successfully", slot: deletedSlot });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const tutorAvailabilityController = {
    createTutorAvailability,
    updateAvailability,
    getMyAvailability,
    getTutorAvailability,
    deleteAvailability
}