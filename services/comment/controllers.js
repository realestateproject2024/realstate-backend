const Comment = require("./commentModel");

exports.getAllComments = async (req, res, next) => {
  const { parentId = null } = req.query;

  try {
    if (parentId && parentId !== null) {
      const comments = await Comment.find({ parentId });

      res.status(200).send({
        status: 200,
        data: comments,
      });
    } else {
      const comments = await Comment.find();

      res.status(200).send({
        status: 200,
        data: comments,
      });
    }
  } catch (error) {
    res.status(404).send({
      status: 404,
      message: "Error: " + error.message,
    });
  }
};

exports.createComment = async (req, res) => {
  try {
    const comment = await Comment.create(req.body);
    res.status(201).send({
      status: 201,
      data: comment,
    });
  } catch (error) {
    res.status(404).send({
      status: 404,
      message: "Error: " + error.message,
    });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const comment = await Comment.findOneAndUpdate(
      { parentId: req.body.parentId },
      req.body,
      {
        new: true,
      }
    );

    if (!comment) {
      throw new Error("Comment not found");
    }

    res.status(200).send({
      status: 200,
      data: comment,
    });
  } catch (error) {
    res.status(404).send({
      status: 404,
      message: "Error: " + error.message,
    });
  }
};

exports.deleteComment = async (req, res) => {
  const { id } = req.query;
  try {
    await Comment.findByIdAndDelete(id);
    res.status(200).send({
      status: 200,
      message: "comment deleted successfully",
    });
  } catch (error) {
    res.status(404).send({
      status: 404,
      message: "Error: " + error.message,
    });
  }
};
