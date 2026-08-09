import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import fs from "fs";

async function pdfParsing(file) {
  try {
    if (!file || !file.path) {
      throw new Error("No file path provided");
    }

    if (!fs.existsSync(file.path)) {
      throw new Error("File does not exist");
    }

    const data = new Uint8Array(fs.readFileSync(file.path));

    if (data.length === 0) {
      throw new Error("File is empty");
    }

    const pdf = await pdfjsLib.getDocument({
      data,
    }).promise;

    if (!pdf || pdf.numPages === 0) {
      throw new Error("Invalid PDF or PDF has no pages");
    }

    let text = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      try {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();
        
        if (content && content.items) {
          text += content.items.map((item) => item.str).join(" ");
        }
        text += "\n";
      } catch (pageError) {
        console.warn(`Error processing page ${pageNum}:`, pageError);
        continue; // Skip problematic pages
      }
    }

    if (!text || text.trim().length === 0) {
      throw new Error("No text content extracted from PDF");
    }

    return text;
  } catch (error) {
    console.error("PDF Parsing Error:", error.message);
    throw new Error(`Failed to parse PDF: ${error.message}`);
  }
}

export default pdfParsing;
