import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./databse/connection.js";
import UserRoutes from "./routes/UserRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({
  origin: "https://canova-frontend.netlify.app",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/user", UserRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});