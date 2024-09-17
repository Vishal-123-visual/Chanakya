import mongoose from "mongoose";

const studentNotesSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now(),
    },
    particulars: {
      type: String,
      required: true,
    },
    dateTime: {
      type: Date,
      default: null,
    },
    addedBy: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    // showOnDashboard: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  {
    timestamps: true,
  }
);

const studentNotesModel = mongoose.model("Student-Notes", studentNotesSchema);
export default studentNotesModel;
