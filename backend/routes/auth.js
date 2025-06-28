import express from "express";
import { CRUD } from '../models/Crud.js';

const router = express.Router();

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await CRUD.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found. Please sign up." });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: "Incorrect password." });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        profileImage: user.profileImage
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
