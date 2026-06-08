import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    fileName: String,
    originalName: String,
    fileSize: Number,
    mimeType: String,
    path: String,
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("File", fileSchema);
