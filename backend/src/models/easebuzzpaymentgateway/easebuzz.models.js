import mongoose from "mongoose";

const easeBuzzSchema = new mongoose.Schema(
  {
    studentInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Students",
    },
    companyName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    courseName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    netCourseFees: {
      type: Number,
      required: true,
    },

    remainingFees: {
      type: Number,
      required: true,
    },
    amountPaid: {
      type: Number,
      required: true,
    },
    addedBy: {
      type: String,
      required: true,
    },
    amountDate: {
      type: String,
      //required: true,
      default: Date.now(),
    },
    no_of_installments: {
      type: Number,
    },
    no_of_installments_amount: {
      type: Number,
    },
    reciptNumber: {
      type: String,
      required: true,
      unique: true,
    },
    paymentOption: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentOptions",
    },
    narration: {
      type: String,
    },
    lateFees: {
      type: Number,
    },
    gst_percentage: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const easeBuzzModel = mongoose.model("OnlinePayment", easeBuzzSchema);

export default easeBuzzModel;
