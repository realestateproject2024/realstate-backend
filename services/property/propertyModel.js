const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { dbNames } = require("../../helpers/constants/dbName");
const {
  propertyStatus,
  propertyType,
} = require("../../helpers/constants/localConsts");

const propertySchema = new mongoose.Schema(
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
      type: Number,
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
        propertyStatus.pending,
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
    propertyAge: {
      type: String,
      required: false,
      trim: true,
    },
    propertySpecialDeck: {
      type: String,
      required: false,
      trim: true,
    },
    propertyRole: {
      type: String,
      required: false,
      trim: true,
    },
    propertyDirection: {
      type: String,
      required: false,
      trim: true,
    },
    propertySanitation: {
      type: Boolean,
      required: true,
      default: true,
      trim: true,
    },
    propertyLoungeStaircase: {
      type: Boolean,
      required: true,
      default: true,
      trim: true,
    },
    propertyDriverRoom: {
      type: Boolean,
      required: true,
      default: true,
      trim: true,
    },
    propertyCourtyard: {
      type: Boolean,
      required: true,
      default: true,
      trim: true,
    },
    propertyMaidsRoom: {
      type: Boolean,
      required: true,
      default: true,
      trim: true,
    },
    propertyRooms: {
      type: Number,
      required: true,
      default: 0,
      trim: true,
    },
    propertyLength: {
      type: String,
      required: false,
      trim: true,
    },
    propertyDisplay: {
      type: String,
      required: false,
      trim: true,
    },
    propertyfeatured: {
      type: Boolean,
      default: false,
      trim: true,
    },
    amenities: [
      {
        type: String,
        required: false,
        trim: true,
      },
    ],
    propertyDateAdded: {
      type: Date,
      required: false,
      default: new Date(),
      trim: true,
    },
    propertyLastUpdate: {
      type: Date,
      required: false,
      trim: true,
    },
    propertyListingId: {
      type: String,
      required: false,
      trim: true,
    },
    propertyAdvertisingLicense: {
      type: String,
      required: false,
      trim: true,
    },
    propertyViews: {
      type: Number,
      required: false,
      default: 0,
      trim: true,
    },
    propertyCarEntance: {
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
    propertyDescription: {
      type: String,
      required: false,
    },
    propertyNeighborhood: {
      type: String,
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

const property = mongoose.model(dbNames.propertyModel, propertySchema);

module.exports = property;
