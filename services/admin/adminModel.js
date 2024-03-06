const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { userRole, activeStatus } = require("../../helpers/constants/localConsts");
const { dbNames } = require("../../helpers/constants/dbName");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: [activeStatus.active, activeStatus.inActive, activeStatus.inTask],
      default: activeStatus.active,
    },
    role: {
      type: String,
      enum: [userRole.admin, userRole.executive, userRole.supervisor],
      default: userRole.executive,
    },
  },
  { timestamps: true }
);

adminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }

  next();
});

adminSchema.methods = {
  authenticate: async function (password) {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (error) {
      console.error("Error during password comparison:", error);
      throw new Error("Authentication failed");
    }
  },

  generateJWT: function () {
    const token = jwt.sign(
      {
        _id: this._id,
        email: this.email,
        phone: this.phone,
        role: this.role,
      },
      process.env.AUTH_SECRET_KEY,
      { expiresIn: "1d" }
    );
    return token;
  },
};

const Admin = mongoose.model(dbNames.adminModel, adminSchema);

module.exports = Admin;
