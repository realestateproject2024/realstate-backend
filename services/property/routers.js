const express = require("express");

const {
  createProperty,
  getAllProperty,
  editProperty,
  deleteByPropertyId,
  searchProperty,
} = require("./controllers");
const { requireSignin } = require("../../helpers/middlewares/accessHandles");

const router = express.Router();

router
  .route("/")
  .get(getAllProperty)
  .post(requireSignin, createProperty)
  .patch(requireSignin, editProperty);
router.route("/:id").delete(requireSignin, deleteByPropertyId);
router.route("/search/").get(searchProperty);

module.exports = router;
