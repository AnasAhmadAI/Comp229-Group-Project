import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function register(req, res) {
    try {
        const { email, password, securityAnswer, role } = req.body;  // role added

        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ error: "User already exists" });

        const hashedPw = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            password: hashedPw,
            securityAnswer,
            role: role || "customer"  // default role
        });
        

        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "Invalid credentials" });

        const matches = await bcrypt.compare(password, user.password);
        if (!matches) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id, role: user.role },   // role added to token
            process.env.JWT_SECRET
        );

        res.json({ 
            message: "Login successful", 
            token,
            role: user.role    // frontend can use this
        });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
}

export async function resetPassword(req, res) {
    try {
        const { email, securityAnswer, newPassword } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "User not found" });

        if (user.securityAnswer !== securityAnswer)
            return res.status(400).json({ error: "Security answer incorrect" });

        const hashedPw = await bcrypt.hash(newPassword, 10);
        user.password = hashedPw;

        await user.save();

        res.json({ message: "Password reset successful" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
}

export async function getUsers(req, res) {
    const users = await User.find();
    res.json(users);
}

export async function deleteUser(req, res) {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
}


