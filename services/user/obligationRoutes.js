const express = require("express");
const router = express.Router();

const {
  createUserObligations,
  editUserOblicationById,
  getUserOblicationByUserId,
  deleteUserOblicationById,
} = require("./controllers");

router.route("/").patch(editUserOblicationById).post(createUserObligations);
router.route("/delete/:id").delete(deleteUserOblicationById);
router.route("/edit/:userId").get(getUserOblicationByUserId);

module.exports = router;
