const { insertComment, getComments } = require("../models/commentModel");

const createComment = async (stakeholder_name, section_reference, comment) => {
  if (!stakeholder_name || !comment) {
    throw new Error("stakeholder_name and comment are required");
  }
  return await insertComment(stakeholder_name, section_reference, comment);
};

const getAllComments = async () => {
  return await getComments();
};

module.exports = { createComment, getAllComments };
