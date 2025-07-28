import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import errorHandler from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import { configurePassport } from "./passport.js";
import passport from "passport";
import limiter from "./middleware/rateLimiter.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(limiter);

const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
configurePassport(passport);

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use(errorHandler);

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    app.listen(PORT, () => {
      console.log(`The server is running at port ${PORT}`);
    });
  } catch (err) {
    console.log("Failed to connect DB");
  }
}

startServer();
