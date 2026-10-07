import { randomUUID } from "node:crypto";
import { getCollection } from "../db.js";

export const createPromotion = async (req, res) => {
    const { Title, Description, Discount_Type, Discount_Value, Start_Date, End_Date, Status } = req.body;
    if (![Title, Discount_Type, Discount_Value, Start_Date, End_Date, Status].every((value) => value !== undefined && value !== "")) {
        return res.status(400).json({ success: false, message: "Complete all promotion fields." });
    }

    const promotion = {
        id: randomUUID(),
        Title: String(Title).trim(),
        Description: typeof Description === "string" ? Description.trim() : "",
        Discount_Type: String(Discount_Type),
        Discount_Value: Number(Discount_Value),
        Start_Date: String(Start_Date),
        End_Date: String(End_Date),
        Status: String(Status),
        user_id: req.session.user.user_id,
        CreatedAt: new Date(),
    };

    try {
        await getCollection("promotions").insertOne(promotion);
        return res.status(201).json({ success: true, message: "Promotion created successfully.", id: promotion.id });
    } catch (error) {
        console.error("Unable to create promotion:", error);
        return res.status(500).json({ success: false, message: "Unable to create promotion right now." });
    }
};

export const getPromotions = async (_req, res) => {
    try {
        const promotions = await getCollection("promotions")
            .find({}, { projection: { _id: 0 } })
            .sort({ CreatedAt: -1 })
            .toArray();
        return res.json(promotions);
    } catch (error) {
        console.error("Unable to load promotions:", error);
        return res.status(500).json({ success: false, message: "Unable to load promotions right now." });
    }
};

export const linkPromotionVehicle = async (req, res) => {
    const { promotion_id, plate_Number, Performance } = req.body;
    if (typeof promotion_id !== "string" || !plate_Number) {
        return res.status(400).json({ success: false, message: "Choose a promotion and enter a vehicle plate number." });
    }

    try {
        const [promotion, vehicle] = await Promise.all([
            getCollection("promotions").findOne({ id: promotion_id }),
            getCollection("vehicles").findOne({ plate_Number: String(plate_Number).trim() }),
        ]);
        if (!promotion || !vehicle) {
            return res.status(404).json({ success: false, message: "The selected promotion or vehicle was not found." });
        }
        await getCollection("promotionVehicles").insertOne({
            promotion_id,
            plate_Number: vehicle.plate_Number,
            Performance: typeof Performance === "string" ? Performance.trim() : "",
            CreatedAt: new Date(),
        });
        return res.status(201).json({ success: true, message: "Promotion linked to vehicle successfully." });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: "This promotion is already linked to that vehicle." });
        }
        console.error("Unable to link promotion and vehicle:", error);
        return res.status(500).json({ success: false, message: "Unable to link promotion right now." });
    }
};
