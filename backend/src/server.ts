import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import { corsOptions } from "./config/corsOptions.js";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// middleware
app.use(cors(corsOptions));
app.use(express.json());
// Read cookies sent by the browser and put them inside req.cookies.
app.use(cookieParser());


// auth routes
app.use("/api/auth", authRouter);

// user routes
app.use("/api/user", userRouter)


connectDB();


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
