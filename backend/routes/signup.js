import express from 'express';
import { CRUD } from '../models/CRUD.js'; // ✅ Correct ES Module import

const router = express.Router();

router.post('/', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await CRUD.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const newUser = new CRUD({ username, email, password });
    await newUser.save();

    console.log("✅ USER ID:", newUser._id); // ✅ Confirm this logs properly

    res.status(201).json({
      message: "Data saved successfully!",
      userId: newUser._id // ✅ This should now work
    });

  } catch (err) {
    console.error("❌ Error during signup:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
