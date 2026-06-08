import mongoose from "mongoose";

import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();



const PORT = process.env.PORT || 5002;

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

}).catch((err) => {
    console.log("Error connecting to MongoDB", err);
});

