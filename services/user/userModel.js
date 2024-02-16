const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { userRole } = require("../../helpers/constants/localConsts");
const { dbNames } = require("../../helpers/constants/dbName");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    dob: {
      type: Date,
      required: true,
      trim: true,
    },
    phone: {
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
    employmentType: {
      type: String,
      required: false,
      trim: true,
    },
    employmentGrade: {
      type: String,
      required: false,
      trim: true,
    },
    employerName: {
      type: String,
      required: false,
      trim: true,
    },
    dateOfJoiing: {
      type: String,
      required: false,
      trim: true,
    },
    basicSalary: {
      type: String,
      required: false,
      trim: true,
    },
    totalSalary: {
      type: String,
      required: false,
      trim: true,
    },
    role: {
      type: String,
      default: userRole.user,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }

  next();
});

userSchema.methods = {
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

const User = mongoose.model(dbNames.userModel, userSchema);

module.exports = User;
