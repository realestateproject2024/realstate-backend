const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { dbNames } = require("../../helpers/constants/dbName");

const otpSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    otp: {
      type: String,
      required: false,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: {
        expires: 100,
      },
    },
  },
  { timestamps: true }
);

otpSchema.pre("save", async function (next) {
  if (this.isModified("otp")) {
    this.otp = await bcrypt.hash(this.otp, 12);
  }

  next();
});

otpSchema.methods = {
  authenticate: async function (otp) {
    try {
      return await bcrypt.compare(otp, this.otp);
    } catch (error) {
      console.error("Error during password comparison:", error);
      throw new Error("Authentication failed");
    }
  },
};

const otp = mongoose.model(dbNames.otpModel, otpSchema);

module.exports = otp;
