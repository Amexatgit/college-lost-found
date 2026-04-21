import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import lostItemRoutes from "./routes/lostItems.js";
import teacherRoutes from "./routes/teachers.js";
import fileRoutes from "./routes/files.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

await connectDB();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve uploads from root level uploads folder
app.use("/uploads", express.static(path.join(__dirname, "../../../uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/lost-items", lostItemRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/files", fileRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});