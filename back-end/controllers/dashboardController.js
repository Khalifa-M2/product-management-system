import { getCollection } from "../db.js";

export async function getDashboard(_req, res) {
    try {
        const vehicles = getCollection("vehicles");
        const customers = getCollection("customers");
        const promotions = getCollection("promotions");
        const [vehiclesTotal, availableVehicles, customersTotal, activePromotions, vehicleStatuses, recentVehicles, valueResult] = await Promise.all([
            vehicles.countDocuments(),
            vehicles.countDocuments({ Status: { $regex: /^available$/i } }),
            customers.countDocuments(),
            promotions.countDocuments({ Status: { $regex: /^active$/i } }),
            vehicles.aggregate([
                { $group: { _id: "$Status", total: { $sum: 1 } } },
                { $sort: { total: -1 } },
            ]).toArray(),
            vehicles.find({}, {
                projection: { _id: 0, plate_Number: 1, Brand: 1, Model: 1, Year: 1, Status: 1 },
            }).sort({ CreatedAt: -1 }).limit(5).toArray(),
            vehicles.aggregate([
                { $group: { _id: null, total: { $sum: { $convert: { input: "$Purchase_Price", to: "double", onError: 0, onNull: 0 } } } } },
            ]).toArray(),
        ]);

        return res.json({
            vehiclesTotal,
            availableVehicles,
            customersTotal,
            activePromotions,
            fleetValue: valueResult[0]?.total || 0,
            vehicleStatuses: vehicleStatuses.map((status) => ({
                status: status._id || "Unspecified",
                total: status.total,
            })),
            recentVehicles,
        });
    } catch (error) {
        console.error("Unable to load dashboard:", error);
        return res.status(500).json({ success: false, message: "Unable to load dashboard data." });
    }
}
