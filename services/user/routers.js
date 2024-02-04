const express = require("express");
const router = express.Router();

const {
  createNewUser,
  signUp,
  getUserById,
  updateUserById,
  deleteUserById,
  verifyOtp,
} = require("./controllers");

router.route("/signUp").post(signUp);
router.route("/verifyOtp").post(verifyOtp);

router.route("/").post(createNewUser);

router
  .route("/:id")
  .patch(updateUserById)
  .get(getUserById)
  .delete(deleteUserById);

module.exports = router;
