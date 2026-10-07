import { getCollection } from "../db.js";

export const getReport = async (_req, res) => {
    try {
        const [customers, links, promotions, vehicles] = await Promise.all([
            getCollection("customers").find({}, { projection: { _id: 0 } }).toArray(),
            getCollection("promotionVehicles").find({}, { projection: { _id: 0 } }).toArray(),
            getCollection("promotions").find({}, { projection: { _id: 0 } }).toArray(),
            getCollection("vehicles").find({}, { projection: { _id: 0 } }).toArray(),
        ]);

        const promotionById = new Map(promotions.map((promotion) => [promotion.id, promotion]));
        const vehicleByPlate = new Map(vehicles.map((vehicle) => [vehicle.plate_Number, vehicle]));
        const rows = [];

        for (const link of links) {
            const promotion = promotionById.get(link.promotion_id);
            const vehicle = vehicleByPlate.get(link.plate_Number);
            if (!promotion || !vehicle) continue;
            for (const customer of customers) {
                rows.push({
                    CustomerName: `${customer.FirstName} ${customer.LastName}`,
                    VehicleBrand: vehicle.Brand,
                    VehicleModel: vehicle.Model,
                    PromotionTitle: promotion.Title,
                    DiscountValue: promotion.Discount_Value,
                    Performance: link.Performance,
                });
            }
        }

        return res.json(rows);
    } catch (error) {
        console.error("Unable to generate report:", error);
        return res.status(500).json({ success: false, message: "Unable to generate report right now." });
    }
};
