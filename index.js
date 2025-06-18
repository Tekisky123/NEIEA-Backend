import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import donationRoutes from './routes/donationRoutes.js';
import cors from "cors"

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cors())

app.use('/donation', donationRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
