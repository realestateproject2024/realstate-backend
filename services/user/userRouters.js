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
  createUserObligations,
  editUserOblicationById,
  getUserOblicationByUserId,
  deleteUserOblicationById,
} = require("./controllers");

router.route("/signUp").post(signUp);
router.route("/verifyOtp").post(verifyOtp);

router.route("/register").post(createNewUser);
router.route("/login").post(loginUser);

router
  .route("/:id")
  .patch(updateUserById)
  .get(getUserById)
  .delete(deleteUserById);

router.route("/").patch(editUserOblicationById).post(createUserObligations);
router.route("/:userId").get(getUserOblicationByUserId);
router.route("/:id").patch(deleteUserOblicationById);

module.exports = router;
