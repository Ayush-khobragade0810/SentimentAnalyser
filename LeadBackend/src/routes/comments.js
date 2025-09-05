// comments.js
import express from "express";
import { createComment, getAllComments } from "./src/services/commentService.js";

const router = express.Router();

// POST new comment
router.post("/", async (req, res) => {
  try {
    const { stakeholderName, sectionReference, comment } = req.body;
    const newComment = await createComment(stakeholderName, sectionReference, comment);
    res.status(201).json(newComment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET all comments
router.get("/", async (req, res) => {
  try {
    const comments = await getAllComments();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
