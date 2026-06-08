import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import fs from "fs";

async function pdfParsing(file) {
  const data = new Uint8Array(fs.readFileSync(file.path));

  const pdf = await pdfjsLib.getDocument({
    data,
  }).promise;

  let text = "";

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);

    const content = await page.getTextContent();

    text += content.items.map((item) => item.str).join(" ");

    text += "\n";
  }

  return text;
}

export default pdfParsing;
