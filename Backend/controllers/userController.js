import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// =======================
// REGISTER
// =======================
export async function register(req, res) {
    try {
        const { email, password, securityAnswer, role } = req.body;

        // basic validation
        if (!email || !password || !securityAnswer) {
            return res
                .status(400)
                .json({ error: "Email, password and security answer are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            // 409 = conflict (already exists)
            return res
                .status(409)
                .json({ error: "User already exists. Please sign in." });
        }

        const hashedPw = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            password: hashedPw,
            securityAnswer,
            role: role || "customer" // default role
        });

        // IMPORTANT: send a response on success
        return res
            .status(201)
            .json({ message: "User created successfully", id: user._id });
    } catch (error) {
        console.error("Register error:", error);
        return res
            .status(500)
            .json({ error: "Server error while creating user" });
    }
}

// =======================
// LOGIN
// =======================
export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ error: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const matches = await bcrypt.compare(password, user.password);
        if (!matches) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.json({
            message: "Login successful",
            token,
            role: user.role
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ error: "Server error" });
    }
}

// =======================
// RESET PASSWORD
// =======================
export async function resetPassword(req, res) {
    try {
        const { email, securityAnswer, newPassword } = req.body;

        if (!email || !securityAnswer || !newPassword) {
            return res.status(400).json({
                error: "Email, security answer and new password are required"
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        if (user.securityAnswer !== securityAnswer) {
            return res
                .status(400)
                .json({ error: "Security answer incorrect" });
        }

        const hashedPw = await bcrypt.hash(newPassword, 10);
        user.password = hashedPw;
        await user.save();

        return res.json({ message: "Password reset successful" });
    } catch (error) {
        console.error("Reset password error:", error);
        return res.status(500).json({ error: "Server error" });
    }
}

// =======================
// ADMIN: GET USERS
// =======================
export async function getUsers(req, res) {
    try {
        const users = await User.find();
        return res.json(users);
    } catch (error) {
        console.error("Get users error:", error);
        return res.status(500).json({ error: "Server error" });
    }
}

// =======================
// ADMIN: DELETE USER
// =======================
export async function deleteUser(req, res) {
    try {
        await User.findByIdAndDelete(req.params.id);
        return res.json({ message: "User deleted" });
    } catch (error) {
        console.error("Delete user error:", error);
        return res.status(500).json({ error: "Server error" });
    }
}
