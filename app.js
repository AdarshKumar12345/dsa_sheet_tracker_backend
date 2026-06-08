import express from "express";

import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import sheetRouter from "./routes/sheetRouter.js"
import authRouter from "./routes/authRouter.js"
import { auth } from "./middlewares/authMiddleware.js"

const app = express();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(auth);
app.use("/api/sheet", sheetRouter);
app.use("/api/auth", authRouter);



app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to DSA Sheet API"
    });
});

export default app;
