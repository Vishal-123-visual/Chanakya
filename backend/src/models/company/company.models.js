import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    logo: {
      type: String,
    },
    companyName: {
      type: String,
      required: true,
      unique: true,
    },
    companyAddress: {
      type: String,
      required: true,
    },
    reciptNumber: {
      type: Number,
      required: true,
    },
    gst: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
const CompanyModels = mongoose.model("Company", companySchema);
export default CompanyModels;
