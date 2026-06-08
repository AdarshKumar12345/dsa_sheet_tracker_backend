import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
    number: Number,
    title: String,
    topic: String,
    urlleetcode: String|| null,
    urlgfg: String || null,
    urlcodeforces: String || null,
    difficulty: String,
});

export default mongoose.model("Question", QuestionSchema);
