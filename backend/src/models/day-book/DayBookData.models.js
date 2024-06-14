import mongoose from "mongoose";

const dayBookDataSchema = new mongoose.Schema(
  {
    studentInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Students",
    },
    rollNo: {
      type: String,
    },
    StudentName: {
      type: String,
    },

    studentLateFees: {
      type: Number,
      default: 0,
    },

    dayBookDatadate: {
      type: Date,
      default: Date.now(),
    },
    accountName: {
      type: String,
    },
    naretion: {
      type: String,
    },
    debit: {
      type: Number,
      default: 0,
    },
    credit: {
      type: Number,
      default: 0,
    },
    dayBookAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DayBookAccount",
    },
    balance: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const DayBookDataModel = mongoose.model("DayBookData", dayBookDataSchema);
export default DayBookDataModel;
