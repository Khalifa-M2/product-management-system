export function requireAuth(req, res, next) {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: "Sign in to continue." });
    }
    return next();
}

export function requireAdmin(req, res, next) {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: "Sign in to continue." });
    }
    if (req.session.user.Role !== "admin") {
        return res.status(403).json({ success: false, message: "Administrator access is required." });
    }
    return next();
}
