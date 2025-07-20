import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import donationRoutes from "./routes/donationRoutes.js";
import cors from "cors";
import donorUserRoutes from "./routes/donorUserRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import carouselRoutes from "./routes/carouselRoutes.js";
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();

connectDB();

const app = express();
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors({
    origin:"*",
    methods:"GET,POST,PUT,PATCH,DELETE,ALL"
}));

app.use("/donation", donationRoutes);
app.use("/donor", donorUserRoutes);
app.use("/admin", adminRoutes);
app.use("/course", courseRoutes);
app.use("/carousel", carouselRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
