import express from "express";
import { createPromotion, getPromotions, linkPromotionVehicle } from "../controllers/promotionController.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

const router = express.Router();
router.use(requireAuth);
router.post("/", requireAdmin, createPromotion);
router.get("/", getPromotions);
router.post("/link", requireAdmin, linkPromotionVehicle);

export default router;