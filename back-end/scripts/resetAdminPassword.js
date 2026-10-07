import "dotenv/config";
import bcrypt from "bcrypt";
import { closeDatabase, connectToDatabase, getCollection } from "../db.js";

async function resetAdminPassword() {
    const username = process.env.ADMIN_USERNAME?.trim();
    const password = process.env.ADMIN_PASSWORD;

    if (!username || !password || password.length < 12) {
        throw new Error("Set ADMIN_USERNAME and an ADMIN_PASSWORD of at least 12 characters in back-end/.env.");
    }

    await connectToDatabase();
    const users = getCollection("users");
    const existing = await users.findOne({ Username: username });

    if (!existing) {
        throw new Error(`No account named "${username}" exists yet. Start the API once to provision the initial administrator.`);
    }
    if (existing.Role !== "admin") {
        throw new Error(`The account "${username}" is not an administrator; refusing to change its password.`);
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await users.updateOne(
        { _id: existing._id },
        { $set: { Password: passwordHash } }
    );
    console.log(`Password updated for administrator "${username}".`);
}

try {
    await resetAdminPassword();
} catch (error) {
    console.error(error.message);
    process.exitCode = 1;
} finally {
    await closeDatabase();
}
