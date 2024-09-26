import mongoose from "mongoose";

const emailRemainderDatesSchema = new mongoose.Schema({
  firstRemainderDay: {
    type: Number,
    default: 9,
    // required: true,
  },
  secondRemainderDay: {
    type: Number,
    default: 15,
    // required: true,
  },
  thirdRemainderDay: {
    type: Number,
    default: 20,
    // required: true,
  },
});

const emailRemainderDatesModel = mongoose.model(
  "Remainder-Date",
  emailRemainderDatesSchema
);

export default emailRemainderDatesModel;
