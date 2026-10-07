import "dotenv/config";
import bcrypt from "bcrypt";
import express from "express";
import cors from "cors";
import session from "express-session";
import { connectToDatabase, getCollection } from "./db.js";

import authRoutes from "./routes/authRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import promotionRoutes from "./routes/promotionRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import { requireAuth } from "./middleware/auth.js";
import { getDashboard } from "./controllers/dashboardController.js";

const app = express();
const port = Number(process.env.PORT || 5001);

async function provisionInitialAdmin() {
    const username = process.env.ADMIN_USERNAME?.trim();
    const password = process.env.ADMIN_PASSWORD;
    if (!username && !password) return;
    if (!username || !password || password.length < 12) {
        throw new Error("Set both ADMIN_USERNAME and an ADMIN_PASSWORD with at least 12 characters.");
    }

    const users = getCollection("users");
    const existing = await users.findOne({ Username: username });
    if (existing) {
        if (existing.Role !== "admin") {
            throw new Error(`The configured administrator username "${username}" belongs to a non-admin account.`);
        }
        return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await users.insertOne({
        Username: username,
        Password: passwordHash,
        Role: "admin",
        CreatedAt: new Date(),
    });
    console.log(`Provisioned initial administrator "${username}".`);
}

if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
    throw new Error("Set SESSION_SECRET to a random value of at least 32 characters in back-end/.env.");
}

app.use(express.json({ limit: "1mb" }));
app.use(cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
}));
app.use(session({
    name: "swiftwheels.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 8,
    },
}));

app.get("/", (_req, res) => res.send("SwiftWheels API is running."));
app.use("/api/auth", authRoutes);
app.get("/api/dashboard", requireAuth, getDashboard);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/promotions", promotionRoutes);
app.use("/api/reports", reportRoutes);

await connectToDatabase();
await provisionInitialAdmin();
app.listen(port, () => console.log(`SwiftWheels API is running on port ${port}.`));
