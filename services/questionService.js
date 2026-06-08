import Question from "../models/Question.js";

async function saveQuestion(question) {
    const existingQuestion = await Question.findOne({
        title: question.title,
    });
    if (existingQuestion) {
        return existingQuestion;
    }
    return await Question.create({
        number: question.number,
        title: question.title,
        topic: question.topic,
        urlleetcode: question.urlleetcode || null,
        urlgfg: question.urlgfg || null,
        urlcodeforces: question.urlcodeforces || null,
        difficulty: question.difficulty,
    });
}

async function findQuestion(title) {
    return await Question.findOne({
        title: {
            $regex: new RegExp(
                "^" + title + "$",
                "i"
            )
        }
    });
}

export { findQuestion, saveQuestion };

