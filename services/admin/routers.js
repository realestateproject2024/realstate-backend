const express = require("express");
const { login, createUser } = require("./controllers");

const router = express.Router();

router.route("/signup").post(createUser);
router.route("/login").post(login);

module.exports = router;
