const commentService = require("../services/commentService");
const generateSummary = require("./geminiAnalysis");

exports.createComment = async (req, res) => {
  try {
    // ✅ Accept both camelCase and snake_case
    const stakeholder_name = req.body.stakeholder_name || req.body.stakeholderName;
    const section_reference = req.body.section_reference || req.body.sectionReference;
    const comment = req.body.comment;

    if (!stakeholder_name || !comment) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log("👉 createComment called"); // debug log

    const saved = await commentService.createComment(
      stakeholder_name,
      section_reference,
      comment
    );

    const res = (async () => {
      const result = await analyzeTextWithGemini(saved.comment);
      console.log('result from analyzeTextWithGemini ',result);
      return result;
    })();
    

    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Error saving comment:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await commentService.getAllComments();
    res.json(comments);
  } catch (err) {
    console.error("❌ Error fetching comments:", err);
    res.status(500).json({ error: "Server error" });
  }
};
