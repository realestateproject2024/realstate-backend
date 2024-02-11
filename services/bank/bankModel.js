const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { userRole } = require("../../helpers/constants/localConsts");
const { dbNames } = require("../../helpers/constants/dbName");

const bankSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: false,
      trim: true,
    },
    address: {
      type: String,
      required: false,
      trim: true,
    },
    phone: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      trim: true,
    },
    branchName: {
      type: String,
      required: false,
      trim: true,
    },
    branchCode: {
      type: String,
      required: false,
      trim: true,
    },
    city: {
      type: String,
      required: false,
      trim: true,
    },
    state: {
      type: String,
      required: false,
      trim: true,
    },
    iban: {
      type: String,
      required: false,
      trim: true,
    },
    swiftNumber: {
      type: String,
      required: false,
      trim: true,
    },
  },
  { timestamps: true }
);

const Bank = mongoose.model(dbNames.bankModel, bankSchema);

module.exports = Bank;
