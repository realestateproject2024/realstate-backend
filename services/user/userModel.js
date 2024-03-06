const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { userRole, employment } = require("../../helpers/constants/localConsts");
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
      status: {
        type: String,
        enum: [employment.private, employment.police],
        required: false,
      },
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
      type: Date,
      required: false,
      trim: true,
    },
    basicSalary: {
      type: Number,
      required: false,
      trim: true,
    },
    totalSalary: {
      type: Number,
      required: false,
      trim: true,
    },
    role: {
      type: String,
      default: userRole.user,
      required: true,
    },
    financerName: {
      type: String,
      required: false,
      trim: true,
    },
    instalmentType: {
      type: String,
      required: false,
      trim: true,
    },
    amount: {
      type: Number,
      required: false,
      trim: true,
    },
    emisPaid: {
      type: Number,
      required: false,
      trim: true,
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
