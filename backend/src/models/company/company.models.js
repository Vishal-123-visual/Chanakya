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
      type: String,
      required: true,
    },
    gst: {
      type: String,
    },
  },
  { timestamps: true }
);
const CompanyModels = mongoose.model("Company", companySchema);
export default CompanyModels;
