const express = require("express");
const router = express.Router();

const {
  createNewUser,
  signUp,
  getUserById,
  updateUserById,
  deleteUserById,
  verifyOtp,
  loginUser,
  getAllUsers,
} = require("./controllers");

router.route("/signUp").post(signUp);
router.route("/verifyOtp").post(verifyOtp);

router.route("/register").post(createNewUser);
router.route("/login").post(loginUser);
router.route("/").get(getAllUsers).delete(deleteUserById);

router
  .route("/:id")
  .patch(updateUserById)
  .get(getUserById)
  .delete(deleteUserById);

module.exports = router;
