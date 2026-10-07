import express from "express";
import { createCustomer, searchCustomers } from "../controllers/customerController.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

const router = express.Router();
router.use(requireAuth);
router.post("/", requireAdmin, createCustomer);
router.get("/search", requireAdmin, searchCustomers);

export default router;