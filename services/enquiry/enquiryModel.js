const mongoose = require("mongoose");

const { dbNames } = require("../../helpers/constants/dbName");
const { priority, taskStatus } = require("../../helpers/constants/localConsts");

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    dueDate: {
      type: String,
      required: false,
      trim: true,
    },
    priority: {
      type: String,
      enum: [priority.low, priority.medium, priority.high, priority.veryHigh],
      default: priority.low,
    },
    status: {
      type: String,
      enum: [
        taskStatus.created,
        taskStatus.pending,
        taskStatus.hold,
        taskStatus.terminated,
        taskStatus.finished,
      ],
      default: taskStatus.created,
    },
    properties: [
      {
        propertyId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: dbNames.propertyModel,
          required: true,
          trim: true,
        },
        propertyTitle: {
          type: String,
          ref: dbNames.propertyModel,
          required: true,
          trim: true,
        },
        dueDate: {
          type: String,
          required: false,
          trim: true,
        },
        priority: {
          type: String,
          enum: [
            priority.low,
            priority.medium,
            priority.high,
            priority.veryHigh,
          ],
          default: priority.low,
        },
        status: {
          type: String,
          enum: [
            taskStatus.created,
            taskStatus.pending,
            taskStatus.hold,
            taskStatus.terminated,
            taskStatus.finished,
          ],
          default: taskStatus.created,
        },
        tasks: [
          {
            taskName: {
              type: String,
              required: true,
              trim: true,
            },
            dueDate: {
              type: String,
              required: false,
              trim: true,
            },
            priority: {
              type: String,
              enum: [
                priority.low,
                priority.medium,
                priority.high,
                priority.veryHigh,
              ],
              default: priority.low,
            },
            status: {
              type: String,
              enum: [
                taskStatus.created,
                taskStatus.pending,
                taskStatus.hold,
                taskStatus.terminated,
                taskStatus.finished,
              ],
              default: taskStatus.created,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const Enquiry = mongoose.model(dbNames.enquiryModel, enquirySchema);

module.exports = Enquiry;
