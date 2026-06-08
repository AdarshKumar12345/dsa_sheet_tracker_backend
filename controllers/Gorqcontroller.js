
import Groq from "groq-sdk";
import { DefaultDeserializer } from "v8";

async function pdfGroq_parse(pdfText) {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const prompt = `
You are given text extracted from a DSA sheet PDF.

Extract all coding questions and return ONLY valid JSON.

Schema:
[
{
"number": 1,
"title": "Two Sum",
"topic": "Array",
"urlleetcode": null,
"urlgfg": null,
"urlcodeforces": null,
"difficulty": "Easy"
}
]

Rules:

* Return ONLY valid JSON.
* Do not include markdown.
* Do not include explanations.
* Extract all coding questions from the PDF.
* Infer the topic from the question title.
* Difficulty must be one of: Easy, Medium, Hard, Complex.
* If a LeetCode URL is explicitly present in the PDF, place it in "urlleetcode".
* If a GeeksforGeeks URL is explicitly present in the PDF, place it in "urlgfg".
* If a Codeforces URL is explicitly present in the PDF, place it in "urlcodeforces".
* If a URL is not present in the PDF text, set the corresponding field to null.
* Do NOT generate, guess, or search for URLs.
* Remove duplicate questions.
* Ignore section headings and non-question text.


PDF Text:
${pdfText}
`;


    const responce = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "user",
                content: prompt,

            },
        ],
        temperature: 0,
        max_tokens: 8000
    });

    const result = responce.choices[0].message.content;

    const cleanJson = result
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    console.log(cleanJson);

    return JSON.parse(cleanJson);

}

export default pdfGroq_parse;