const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { dbNames } = require("../../helpers/constants/dbName");
const {
  propertyStatus,
  propertyType,
} = require("../../helpers/constants/localConsts");

const otpSchema = new mongoose.Schema(
  {
    typeOfProperty: {
      type: String,
      enum: [propertyType.commercial, propertyType.residential],
      default: propertyType.residential,
    },
    propertyTitle: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: String,
      required: false,
      trim: true,
    },
    city: {
      type: String,
      required: false,
      trim: true,
    },
    district: {
      type: String,
      required: false,
      trim: true,
    },
    address: {
      type: String,
      required: false,
      trim: true,
    },
    pinCode: {
      type: String,
      required: false,
      trim: true,
    },
    status: {
      type: String,
      enum: [
        propertyStatus.available,
        propertyStatus.available,
        propertyStatus.sold,
        propertyStatus.hold,
        propertyStatus.sale,
      ],
      default: propertyStatus.available,
    },
    region: {
      type: String,
      required: false,
      trim: true,
    },
    yearOfBuild: {
      type: Date,
      required: false,
      trim: true,
    },
    directionFacing: {
      type: String,
      required: false,
      trim: true,
    },
    bedRooms: {
      type: Number,
      required: false,
      trim: true,
    },
    kitchen: {
      type: Number,
      required: false,
      trim: true,
    },
    toilets: {
      type: Number,
      required: false,
      trim: true,
    },
    lounge: {
      type: Boolean,
      required: false,
      default: false,
    },
    elevator: {
      type: Boolean,
      required: false,
      default: false,
    },
    area: {
      type: String,
      required: false,
      trim: true,
    },
    availabilityOfElectricity: {
      type: Boolean,
      required: false,
      dafault: true,
    },
    availabilityOfWater: {
      type: Boolean,
      required: false,
      dafault: true,
    },
    lastRepairing: {
      type: Date,
      required: false,
      trim: true,
    },
    propertyImages: [
      {
        type: String,
        required: false,
        trim: true,
      },
    ],
  },
  { timestamps: true }
);

const property = mongoose.model(dbNames.propertyModel, otpSchema);

module.exports = property;
