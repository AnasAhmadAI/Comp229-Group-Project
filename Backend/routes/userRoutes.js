import express from "express";
import { register, login, resetPassword, getUsers, deleteUser } from "../controllers/userController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/reset", resetPassword);

router.get("/", auth, getUsers);
router.delete("/:id", auth, deleteUser);

export default router;