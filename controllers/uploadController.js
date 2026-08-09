import fs from "fs";
import pdfParsing from "./parsingPDF.js";
import pdfGroq_parse from "./Gorqcontroller.js";
import { findQuestion, saveQuestion } from "../services/questionService.js";
import { searchLinks, isValidUrl } from "../services/UrlService.js";

async function uploadFile(req, res) {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
    });
  }

  const file = req.file;

  try {
    console.log("Starting PDF parsing for file:", file.originalname);
    
    const pdfData = await pdfParsing(file);
    console.log("PDF parsed successfully, length:", pdfData.length);
    
    if (!pdfData || pdfData.trim().length === 0) {
      throw new Error("No text content extracted from PDF. Please ensure the PDF contains searchable text.");
    }

    console.log("Starting Groq parsing...");
    const questions = await pdfGroq_parse(pdfData);
    
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("No questions extracted from PDF. Please check your PDF format.");
    }

    console.log("Questions extracted:", questions.length);
    console.log("Fetching links for questions...");
    
    await fetchLinksOfQuestions(questions);

    res.status(201).json({
      success: true,
      metaData: {
        fileName: file.originalname,
        fileUrl: ""
      },
      questions,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to parse document or sheet layout.",
    });
  } finally {
    if (file && file.path && fs.existsSync(file.path)) {
      try {
        fs.unlinkSync(file.path);
      } catch (err) {
        console.error("Error cleaning up uploaded file:", err);
      }
    }
  }
}

async function fetchLinksOfQuestions(questions) {
  await Promise.all(questions.map(async (question) => {
    try {
      const existing = await findQuestion(question.title);

      if (existing) {
        question.urlleetcode = existing.urlleetcode;
        question.urlgfg = existing.urlgfg;
        question.urlcodeforces = existing.urlcodeforces;
        question._id = existing._id;
        return;
      }
      if (question.urlleetcode || question.urlgfg || question.urlcodeforces) {
        const saved = await saveQuestion({
          number: question.number,
          title: question.title,
          topic: question.topic,
          urlleetcode: question.urlleetcode,
          urlgfg: question.urlgfg,
          urlcodeforces: question.urlcodeforces,
          difficulty: question.difficulty,
        });
        question._id = saved._id;
        return;
      }

      const links = await searchLinks(question.title);

      const saved = await saveQuestion({
        number: question.number,
        title: question.title,
        topic: question.topic,
        urlleetcode: isValidUrl(links.leetcode) ? links.leetcode : null,
        urlgfg: isValidUrl(links.gfg) ? links.gfg : null,
        urlcodeforces: isValidUrl(links.codeforces) ? links.codeforces : null,
        difficulty: question.difficulty,
      });

      question.urlleetcode = saved.urlleetcode;
      question.urlgfg = saved.urlgfg;
      question.urlcodeforces = saved.urlcodeforces;
      question._id = saved._id;
    } catch (error) {
      console.error(
        `Error processing question "${question.title}":`,
        error
      );
    }
  }));
}

export { uploadFile };