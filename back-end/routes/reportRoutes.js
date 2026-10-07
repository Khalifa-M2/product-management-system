import express from "express";
import { getReport } from "../controllers/reportController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
router.use(requireAuth);
router.get("/", getReport);

export default router;