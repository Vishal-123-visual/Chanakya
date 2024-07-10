import mongoose from "mongoose";

const schema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  Date: {
    type: Date,
    required: true,
  },
  RemainderDateAndTime: {
    type: Date,
    required: true,
  },
  Status: {
    type: String,
    required: true,
  },
  particulars: {
    type: String,
    required: true,
  },
});

const AlertStudentPendingFeesModel = new mongoose.model(
  "AlertStudentPendingFees",
  schema
);
export default AlertStudentPendingFeesModel;
