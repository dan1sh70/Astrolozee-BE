import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectdb.js";
import authRoutes from "./routes/authRoutes.js";
import astroRoutes from "./routes/astroRoutes.js";
import kundliRoutes from "./routes/kundliRoutes.js"
import cookieParser from "cookie-parser";
import cors from "cors"


const app = express();

dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "https://astrolozee-frontend.vercel.app", // frontend Vite URL
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);



app.use("/api/auth",authRoutes);
app.use("/api/astro",astroRoutes);
app.use("/api/kundli",kundliRoutes)


export default app;



