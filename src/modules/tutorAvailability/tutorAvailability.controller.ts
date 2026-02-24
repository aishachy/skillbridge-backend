import { Request, Response } from "express";
import { tutorAvailabilityService } from "./tutorAvailability.service";

export const tutorAvailabilityController = {
  async createTutorAvailability(req: Request, res: Response) {
    try {
      const userId = req.user!.id; 

      const { startTime, endTime, status } = req.body;

      const result = await tutorAvailabilityService.create({
        userId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        status
      });

      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },

  async updateAvailability(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { startTime, endTime, status } = req.body;

      const result = await tutorAvailabilityService.update(id, {
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
        status
      });

      res.json(result);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  },

  async getMyAvailability(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);
      const result = await tutorAvailabilityService.getMine(userId);
      res.json(result);
    } catch {
      res.status(500).json({ message: "Failed to fetch availability" });
    }
  },

  async getTutorAvailability(req: Request, res: Response) {
    try {
      const tutorProfileId = Number(req.params.tutorId);
      const result = await tutorAvailabilityService.getAvailable(tutorProfileId);
      res.json(result);
    } catch {
      res.status(500).json({ message: "Failed to fetch availability" });
    }
  },

  async deleteAvailability(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await tutorAvailabilityService.delete(id);
      res.json({ message: "Deleted successfully" });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
};