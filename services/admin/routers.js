const express = require("express");
const {
  login,
  createUser,
  getAllUsers,
  deleteUserById,
} = require("./controllers");

const router = express.Router();

router.route("/signup").post(createUser);
router.route("/login").post(login);
router.route("/").get(getAllUsers).delete(deleteUserById);

module.exports = router;
