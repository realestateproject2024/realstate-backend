const mongoose = require("mongoose");

const { dbNames } = require("../../helpers/constants/dbName");

const commentSchema = new mongoose.Schema(
  {
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      trim: true,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model(dbNames.commentModel, commentSchema);

module.exports = Comment;
