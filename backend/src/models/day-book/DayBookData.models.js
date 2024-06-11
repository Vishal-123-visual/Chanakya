import mongoose from "mongoose";

const dayBookDataSchema = new mongoose.Schema({
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
  },
  credit: {
    type: Number,
  },
  dayBookAccountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DayBookAccount",
    required: true,
  },
});

const DayBookDataModel = mongoose.model("DayBookData", dayBookDataSchema);
export default DayBookDataModel;
