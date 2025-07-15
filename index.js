import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import donationRoutes from "./routes/donationRoutes.js";
import cors from "cors";
import donorUserRoutes from "./routes/donorUserRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import multer from 'multer';
const upload = multer();


dotenv.config();

connectDB();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(upload.none()); // This will parse FormData bodies with no files

app.use(express.json());
app.use(cors({
    origin:"*",
    methods:"GET,POST,PUT,PATCH,DELETE,ALL"
}));

app.use("/donation", donationRoutes);
app.use("/donor", donorUserRoutes);
app.use("/admin", adminRoutes);
app.use("/course", courseRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
