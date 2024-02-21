const express = require("express");
const router = express.Router();

const {
  getAllEnquiry,
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  addPropertyInInquiry,
  updatePropertyInEnquiry,
  deletePropertyInEnquiry,
  addTaskInProperty,
  updateTaskInProperty,
  deleteTaskFromProperty,
} = require("./controllers");

router
  .route("/")
  .get(getAllEnquiry)
  .post(createEnquiry)
  .patch(updateEnquiry)
  .delete(deleteEnquiry);

// property
router
  .route("/property")
  .post(addPropertyInInquiry)
  .patch(updatePropertyInEnquiry)
  .delete(deletePropertyInEnquiry);

// task
router
  .route("/task")
  .post(addTaskInProperty)
  .patch(updateTaskInProperty)
  .delete(deleteTaskFromProperty);

module.exports = router;
