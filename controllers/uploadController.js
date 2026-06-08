import File from "../models/File.js";

import pdfParsing from "./parsingPDF.js";
import pdfGroq_parse from "./Gorqcontroller.js";

import { findQuestion, saveQuestion } from "../services/questionService.js";

import { searchLinks, isValidUrl } from "../services/UrlService.js";
import upload from "./multerController.js";


async function uploadFile(req, res) {
  try {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const file = req.file;

    const metadata = await File.create({
      fileName: file.filename,
      originalName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
      path: file.path,
    });


    const pdfData = await pdfParsing(file);

    const questions = await pdfGroq_parse(pdfData);

    await fetchLinksOfQuestions(questions);

    console.log(questions);


    res.status(201).json({
      success: true,
      metaData: {
        fileName: metadata.fileName,
        fileUrl: `/uploads/${metadata.fileName}`
      },
      questions,
    });


  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function fetchLinksOfQuestions(questions) {
  await Promise.all(questions.map(async (question) => {
    try {
      const existing = await findQuestion(question.title);

      if (existing) {
        console.log(`Question already exists: ${question.title}`);
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

      console.log(`Saved: ${question.title}`);
    } catch (error) {
      console.error(
        `Error processing question "${question.title}":`,
        error
      );
    }
  }));
}

export { uploadFile };