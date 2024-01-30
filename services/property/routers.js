const express = require("express");

const {
  createProperty,
  editProperty,
  getAllProperty,
  deleteByPropertyId,
  searchProperty,
} = require("./controllers");
const { requireSignin } = require("../../helpers/middlewares/accessHandles");

const router = express.Router();

router
  .route("/")
  .get(getAllProperty)
  .post(requireSignin, createProperty)
  .put(editProperty);
router.route("/:id").delete(deleteByPropertyId);
router.route("/search/").get(searchProperty);

module.exports = router;
