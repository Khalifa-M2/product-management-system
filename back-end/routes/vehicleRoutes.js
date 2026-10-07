import express from "express";
import { createVehicle, getVehicles } from "../controllers/vehicleController.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

const router = express.Router();
router.use(requireAuth);
router.post("/", requireAdmin, createVehicle);
router.get("/", getVehicles);

export default router;