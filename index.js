import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectdb.js";
import authRoutes from "./routes/authRoutes.js";
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
    origin: "http://localhost:5173", // frontend Vite URL
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);



app.use("/api/auth",authRoutes);


app.listen (PORT,() => {
    console.log(`Server is running on port ${PORT}`);
})


