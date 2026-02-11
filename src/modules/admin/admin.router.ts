import express from "express";

import auth from "../../middleware/auth";
import { adminController } from "./admin.controller";

const router = express.Router();

router.get("/statistics", auth("ADMIN"), adminController.getStatistics);

export const adminRouter = router;