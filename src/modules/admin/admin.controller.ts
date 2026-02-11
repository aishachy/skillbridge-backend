import { Request, Response } from "express";
import { adminService } from "./admin.service"

export const adminController = {
  getStatistics: async (req: Request, res: Response) => {
    try {
      const stats = await adminService.getDashboardStats()
      res.status(200).json({ 
        success: true,
        data: stats });
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : "Failed to fetch statistics";
      res.status(500).json({ 
        success: false, 
        message: errorMessage });
    }
  }
};
