import { getCollection } from "../db.js";

export const createCustomer = async (req, res) => {
    const { FirstName, LastName, Email, PhoneNumber, Status } = req.body;
    if (![FirstName, LastName, Email, PhoneNumber, Status].every((value) => typeof value === "string" && value.trim())) {
        return res.status(400).json({ success: false, message: "Complete all customer fields." });
    }

    try {
        await getCollection("customers").insertOne({
            FirstName: FirstName.trim(),
            LastName: LastName.trim(),
            Email: Email.trim(),
            PhoneNumber: PhoneNumber.trim(),
            Status,
            user_id: req.session.user.user_id,
            CreatedAt: new Date(),
        });
        return res.status(201).json({ success: true, message: "Customer registered successfully." });
    } catch (error) {
        console.error("Unable to create customer:", error);
        return res.status(500).json({ success: false, message: "Unable to register customer right now." });
    }
};

export const searchCustomers = async (req, res) => {
    const searchTerm = typeof req.query.query === "string" ? req.query.query.trim() : "";
    if (!searchTerm) return res.json([]);
    const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const searchExpression = new RegExp(escapedTerm, "i");

    try {
        const customers = await getCollection("customers")
            .find({
                $or: [
                    { FirstName: searchExpression },
                    { LastName: searchExpression },
                    { Email: searchExpression },
                ],
            }, { projection: { _id: 0 } })
            .sort({ CreatedAt: -1 })
            .toArray();
        return res.json(customers);
    } catch (error) {
        console.error("Unable to search customers:", error);
        return res.status(500).json({ success: false, message: "Unable to search customers right now." });
    }
};
