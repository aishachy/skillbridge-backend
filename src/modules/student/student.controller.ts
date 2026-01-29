import { Request, Response } from "express";
import { studentService } from "./student.service";

const studentBookings = async (req: Request, res: Response) => {
  try {
    const studentId = req.user?.id;
    console.log(studentId);
    if (!studentId) {
      throw new Error("user not found");
    }
    const result = await studentService.studentBookings(studentId);
    res.status(200).json({
      success: true,
      data: result
    })
  } catch (e: any) {
    console.error("dashboard fetched failed:", e)
    res.status(400).json({
      error: "Overview fetch failed",
      details: e.message
    })
  }
}

const getProfile = async (req: Request, res: Response) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const profile = await studentService.getProfile(studentId);
    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: err.message
    });
  }
};

const updateProfile = async (req: Request, res: Response) => {
  try {
    const studentId = req.user?.id;
    if (!studentId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const updated = await studentService.updateProfile(studentId, req.body);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updated
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
    const studentId = req.user?.id; 
    if (!studentId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const stats = await studentService.getStats(studentId)

    res.status(200).json({ success: true, data: stats });
  } catch (e) {
    const errorMessage = (e instanceof Error) ? e.message : "Stats fetched failed!"
    res.status(400).json({
      error: errorMessage,
      details: e
    })
  }
}

export const studentController = {
  studentBookings,
  getProfile,
  updateProfile,
  getStats
}