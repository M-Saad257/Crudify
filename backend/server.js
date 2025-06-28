const app = express();
import cors from 'cors';
app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true
}));
let serverBootId = Date.now(); // place this at the top
app.get("/server-boot", (req, res) => {
  res.json({ bootId: serverBootId });
});
import bodyParser from 'body-parser';
import mongoose from "mongoose";
import express from "express";
import { CRUD } from './models/Crud.js';
import taskRoutes from './routes/tasks.js';
import signinRoutes from './routes/auth.js';
import uploadRoute from './routes/upload.js';
const port = 3000;
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/CRUD", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.error("MongoDB connection error:", err);
});

app.use(cors({
  origin: "http://localhost:5173",  // Allow frontend Vite dev server
  credentials: true                 // Optional, for cookies/auth
}));
app.use(bodyParser.json());
app.use('/tasks', taskRoutes);
app.use('/', signinRoutes);

app.use('/upload', uploadRoute);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.post('/', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await CRUD.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({ error: "Username or email already exists." });
    }

    const newEntry = new CRUD({ username, email, password });
    await newEntry.save();

    console.log("✅ User saved:", newEntry);

    // ✅ FINAL FIX:
    return res.status(201).json({
      message: "Data saved successfully!",
      userId: newEntry._id
    });

  } catch (err) {
    console.error("❌ Error saving data:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});



// Optional health check
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/CRUD', async (req, res) => {
  try {
    const entries = await CRUD.find();

    let html = `
      <html>
      <head>
        <title>Stored Entries</title>
        <style>
          table {
            border-collapse: collapse;
            width: 80%;
            margin: 20px auto;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: center;
          }
          th {
            background-color: #f2f2f2;
          }
        </style>
      </head>
      <body>
        <h2 style="text-align:center">CRUD of Users</h2>
        <table>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Password</th>
          </tr>
    `;

    entries.forEach(entry => {
      html += `
        <tr>
          <td>${entry.username}</td>
          <td>${entry.email}</td>
          <td>${entry.password}</td>
        </tr>
      `;
    });

    html += `
        </table>
      </body>
      </html>
    `;

    res.send(html);
  } catch (err) {
    console.error("Error retrieving entries:", err);
    res.status(500).send("Internal Server Error");
  }
  console.log("Uploading for email:", req.body.email);
  console.log("File received:", req.file?.filename);

});



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
