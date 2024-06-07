import mongoose from "mongoose";

const DayBookAccountSchema = new mongoose.Schema(
  {
    accountName: {
      type: String,
      required: true,
      unique: true,
    },
    accountType: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const DayBookAccountModel = mongoose.model(
  "DayBookAccount",
  DayBookAccountSchema
);

export default DayBookAccountModel;
