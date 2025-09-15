import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectdb.js";
import testRoutes from "./routes/testRoutes.js";

const app = express();

dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;

app.use("/api",testRoutes);

app.listen (PORT,() => {
    console.log(`Server is running on port ${PORT}`);
})


