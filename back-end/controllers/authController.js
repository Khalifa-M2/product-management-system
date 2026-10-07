import bcrypt from "bcrypt";
import { getCollection } from "../db.js";

const publicUser = (user) => ({
    user_id: user._id.toString(),
    Username: user.Username,
    Role: user.Role,
});

export const register = async (req, res) => {
    const Username = typeof req.body.Username === "string" ? req.body.Username.trim() : "";
    const Password = typeof req.body.Password === "string" ? req.body.Password : "";

    if (Username.length < 3 || Username.length > 40 || Password.length < 8) {
        return res.status(400).json({
            success: false,
            message: "Use a username between 3 and 40 characters and a password with at least 8 characters.",
        });
    }

    try {
        const users = getCollection("users");
        const passwordHash = await bcrypt.hash(Password, 12);
        const result = await users.insertOne({
            Username,
            Password: passwordHash,
            Role: "stakeholder",
            CreatedAt: new Date(),
        });
        return res.status(201).json({
            success: true,
            message: "Stakeholder account created. You can now sign in.",
            user_id: result.insertedId.toString(),
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: "That username is already in use." });
        }
        console.error("Unable to register user:", error);
        return res.status(500).json({ success: false, message: "Unable to create the account right now." });
    }
};

export const login = async (req, res) => {
    const Username = typeof req.body.Username === "string" ? req.body.Username.trim() : "";
    const Password = typeof req.body.Password === "string" ? req.body.Password : "";

    if (!Username || !Password) {
        return res.status(400).json({ success: false, message: "Enter your username and password." });
    }

    try {
        const user = await getCollection("users").findOne({ Username });
        if (!user || !(await bcrypt.compare(Password, user.Password))) {
            return res.status(401).json({ success: false, message: "Incorrect username or password." });
        }

        await new Promise((resolve, reject) => {
            req.session.regenerate((error) => (error ? reject(error) : resolve()));
        });
        req.session.user = publicUser(user);
        return res.json({ success: true, message: "Signed in successfully.", user: req.session.user });
    } catch (error) {
        console.error("Unable to sign in:", error);
        return res.status(500).json({ success: false, message: "Unable to sign in right now." });
    }
};

export const getSession = (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ authenticated: false, message: "No active session." });
    }
    return res.json({ authenticated: true, user: req.session.user });
};

export const logout = (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error("Unable to destroy session:", error);
            return res.status(500).json({ success: false, message: "Unable to sign out right now." });
        }
        res.clearCookie("swiftwheels.sid");
        return res.json({ success: true, message: "Signed out successfully." });
    });
};
