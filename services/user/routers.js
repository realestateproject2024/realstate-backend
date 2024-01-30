const express = require("express");
const {
  signUp,
  validateUser,
  verifyOtp,
  getUserById,
  updateUserById,
  deleteUserById,
} = require("./controllers");
const router = express.Router();

router.route("/signUp").post(signUp);
router.route("/verifyOtp").post(verifyOtp);

router.route("/").post(validateUser).put(updateUserById);
router.route("/:id").get(getUserById).delete(deleteUserById);

module.exports = router;
