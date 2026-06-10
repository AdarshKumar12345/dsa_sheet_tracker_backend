import express from "express";
import { uploadFile } from "../controllers/uploadController.js";
import { uploadSheet } from "../controllers/sheetupload.js";
import { getSheetById, getAllSheets } from "../controllers/getSheet.js";
import { createUser, findUser } from "../controllers/handleUsers.js";
import upload from "../controllers/multerController.js";
import User from "../models/User.js";
import Sheet from "../models/Sheet.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/upload", requireAuth, (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }
        await uploadFile(req, res);
    });
});

router.post('/create-sheet', requireAuth, uploadSheet);

router.get('/sheets', requireAuth, async (req, res) => {
    getAllSheets(req, res);
});

router.get('/:id', requireAuth, (req, res) => {
    getSheetById(req, res);
});

router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const sheet = await Sheet.findOne({ id });
        if (!sheet) {
            return res.status(404).json({
                success: false,
                message: "Sheet not found"
            });
        }

        if (sheet.user) {
            if (!req.user || req.user._id.toString() !== sheet.user.toString()) {
                return res.status(403).json({
                    success: false,
                    message: "You are not authorized to delete this sheet"
                });
            }
        }

        await Sheet.deleteOne({ id });

        if (sheet.user) {
            await User.findByIdAndUpdate(sheet.user, {
                $pull: { Sheets: sheet._id }
            });
        }

        return res.status(200).json({
            success: true,
            message: "Sheet deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting sheet:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

router.patch('/question/:id/toggle', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const index = user.questionsSolved.indexOf(id);
        let completed = false;
        if (index > -1) {
            user.questionsSolved.splice(index, 1);
        } else {
            user.questionsSolved.push(id);
            completed = true;
        }
        await user.save();

        return res.status(200).json({
            success: true,
            completed
        });
    } catch (error) {
        console.error("Error toggling completion:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

router.post('/create-user', createUser);

router.post('/find-user', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Email is required",
        });
    }
    const user = await findUser(email);
    if (user) {
        return res.status(200).json({
            success: true,
            data: user,
        });
    } else {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }
});

export default router;