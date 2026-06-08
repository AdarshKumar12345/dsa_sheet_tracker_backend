import Sheet from "../models/Sheet.js";


async function getSheetById(req, res) {
    try {
        const { id } = req.params;
        const sheetData = await Sheet.findOne({ id }).populate('questions');
        if (!sheetData) {
            return res.status(404).json({
                success: false,
                message: "Sheet not found"
            });
        }

        let questions = sheetData.questions.map(q => q.toObject());
        if (req.user) {
            const solvedSet = new Set(req.user.questionsSolved.map(qid => qid.toString()));
            questions = questions.map(q => ({
                ...q,
                completed: solvedSet.has(q._id.toString())
            }));
        } else {
            questions = questions.map(q => ({
                ...q,
                completed: false
            }));
        }

        return res.status(200).json({
            success: true,
            sheetData,
            questions,
        });

    } catch (error) {
        console.error("Error fetching sheet:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

async function getAllSheets(req, res) {
    try {
        const sheets = await Sheet.find().populate('questions');

        return res.status(200).json({
            success: true,
            sheets
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export { getSheetById, getAllSheets };