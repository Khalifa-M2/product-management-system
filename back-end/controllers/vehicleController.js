import { getCollection } from "../db.js";

export const createVehicle = async (req, res) => {
    const { plate_Number, Brand, Model, Year, Vehicle_Type, Purchase_Price, Status } = req.body;
    if (![plate_Number, Brand, Model, Year, Vehicle_Type, Purchase_Price, Status].every((value) => value !== undefined && value !== "")) {
        return res.status(400).json({ success: false, message: "Complete all vehicle fields." });
    }

    try {
        await getCollection("vehicles").insertOne({
            plate_Number: String(plate_Number).trim(),
            Brand: String(Brand).trim(),
            Model: String(Model).trim(),
            Year: Number(Year),
            Vehicle_Type: String(Vehicle_Type).trim(),
            Purchase_Price: Number(Purchase_Price),
            Status: String(Status),
            user_id: req.session.user.user_id,
            CreatedAt: new Date(),
        });
        return res.status(201).json({ success: true, message: "Vehicle added successfully." });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: "A vehicle with that plate number already exists." });
        }
        console.error("Unable to create vehicle:", error);
        return res.status(500).json({ success: false, message: "Unable to add vehicle right now." });
    }
};

export const getVehicles = async (_req, res) => {
    try {
        const vehicles = await getCollection("vehicles")
            .find({}, { projection: { _id: 0 } })
            .sort({ CreatedAt: -1 })
            .toArray();
        return res.json(vehicles);
    } catch (error) {
        console.error("Unable to load vehicles:", error);
        return res.status(500).json({ success: false, message: "Unable to load vehicles right now." });
    }
};
