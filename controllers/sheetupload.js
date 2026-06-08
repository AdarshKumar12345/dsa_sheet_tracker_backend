import mongoose from "mongoose";
import Sheet from "../models/Sheet.js";
import User from "../models/User.js";

async function uploadSheet(req, res) {
  try {
    const { sheetName, questions, metaData } = req.body;
    const newSheet = await Sheet.create({
      id: new mongoose.Types.ObjectId().toString(),
      user: req.user ? req.user._id : null,
      title: sheetName,

      fileName: metaData.fileName,
      fileUrl: metaData.fileUrl,
      totalQuestions: questions.length,
      questions: [
        ...questions.map((q) => new mongoose.Types.ObjectId(q._id)),
      ],


    });

    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, {
        $push: { Sheets: newSheet._id }
      });
    }

    return res.status(201).json({
      success: true,
      data: newSheet,
      sheetId: newSheet.id,
    })

  } catch (error) {
    console.error("Error uploading sheet:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export { uploadSheet };
