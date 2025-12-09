import express from "express";
import {
    register,
    login,
    resetPassword,
    getUsers,
    deleteUser
} from "../controllers/userController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// small helper to check admin role
function admin(req, res, next) {
    if (req.userRole !== "admin") {
        return res.status(403).json({ error: "Admin only" });
    }
    next();
}

// public routes
router.post("/register", register);
router.post("/login", login);
router.post("/reset", resetPassword);

// protected admin routes
router.get("/", auth, admin, getUsers);
router.delete("/:id", auth, admin, deleteUser);

export default router;
