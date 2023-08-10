import express from "express";
import dotenv from "dotenv";
import connectdb from "./config/db.js";
import morgan from "morgan";
import cors from "cors";
import userRouter from "./routes/User.js";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import path from "path";
import { fileURLToPath } from "url";

//configure env
dotenv.config();

//databse config
connectdb();

//es module to fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// rest object
const app = express();

// middelwares
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "./client/build")));

app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

app.use("/api/v1", userRouter);
//rest api
app.use("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`server is running ${PORT}`);
});
