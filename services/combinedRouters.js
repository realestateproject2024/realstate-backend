const express = require("express");
const router = express.Router();

// Import route handlers
const userRoutes = require("./user/userRouters");
const propertyRoutes = require("./property/routers");
const adminRoutes = require("./admin/routers");
const bankRoutes = require("./bank/routers");
const enquiryRoutes = require("./enquiry/routers");
const CommentRoutes = require("./comment/routers");

// Define routes
router.use("/user", userRoutes);
router.use("/property", propertyRoutes);
router.use("/admin", adminRoutes);
router.use("/bank", bankRoutes);
router.use("/enquiry", enquiryRoutes);
router.use("/comment", CommentRoutes);

module.exports = router;
