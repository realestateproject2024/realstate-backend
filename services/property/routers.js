const express = require("express");

const {
  createProperty,
  getAllProperty,
  editProperty,
  deleteByPropertyId,
  searchProperty,
  getPropertyById,
} = require("./controllers");
const { requireSignin } = require("../../helpers/middlewares/accessHandles");

const router = express.Router();

// router
//   .route("/")
//   .get(getAllProperty)
//   .post(requireSignin, createProperty)
//   .patch(requireSignin, editProperty);
// router
//   .route("/:id")
//   .delete(requireSignin, deleteByPropertyId)
//   .get(getPropertyById);
// router.route("/search/").get(searchProperty);

router.route("/").get(getAllProperty).post(createProperty).patch(editProperty);
router.route("/:id").delete(deleteByPropertyId).get(getPropertyById);
router.route("/search/").get(searchProperty);

module.exports = router;
