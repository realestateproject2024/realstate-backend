const express = require("express");

const { requireSignin } = require("../../helpers/middlewares/accessHandles");
const {
  getAllBanks,
  createNewBank,
  getBankById,
  updateBankById,
  deleteBankById,
} = require("./controllers");

const router = express.Router();

router.route("/").get(getAllBanks).post(createNewBank).patch(updateBankById);
router
  .route("/:id")
  .get(getBankById)

  .delete(deleteBankById);

module.exports = router;
