const express = require("express");
const router = express.Router();

const {
  getAllComments,
  createComment,
  updateComment,
  deleteComment,
} = require("./controllers");

router
  .route("/")
  .get(getAllComments)
  .post(createComment)
  .patch(updateComment)
  .delete(deleteComment);

module.exports = router;
