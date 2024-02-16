const mongoose = require("mongoose");

const { dbNames } = require("../../helpers/constants/dbName");

const userObligationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: dbNames.userModel,
      required: true,
    },
    financerName: {
      type: String,
      required: true,
      trim: true,
    },
    instalmentType: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      trim: true,
    },
    emisPaid: {
      type: Number,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const UserObligation = mongoose.model(
  dbNames.userOblication,
  userObligationSchema
);

module.exports = UserObligation;
