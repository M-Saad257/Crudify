// routes/upload.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { CRUD } from '../models/Crud.js';

const router = express.Router();

// These 2 lines help resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Use absolute path to uploads folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// ✅ POST upload route
router.post("/", upload.single("profileImage"), async (req, res) => {
  const email = req.body.email;
  const filename = req.file?.filename;

  if (!filename || !email) {
    return res.status(400).json({ error: "Missing file or email" });
  }
console.log("Uploading file for email:", req.body.email);
console.log("Saved file name:", req.file?.filename);

  try {
    const user = await CRUD.findOneAndUpdate(
      { email },
      { profileImage: filename },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ filename });
  } catch (error) {
    console.error("❌ Upload error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;