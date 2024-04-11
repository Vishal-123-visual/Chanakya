import asyncHandler from "../middlewares/asyncHandler.js";
import PaymentOptionsModel from "../models/payment-options/paymentoption.models.js";

export const createPaymentOptionController = asyncHandler(
  async (req, res, next) => {
    try {
      const { name, date } = req.body;
      if (!name) {
        return res
          .status(400)
          .json({ error: "Payment Option Name is required" });
      }
      const newPaymentOption = new PaymentOptionsModel({
        name,
        createdBy: req.user.fName + " " + req.user.lName,
        date,
      });
      const savedPaymentOptions = await newPaymentOption.save();
      res.status(201).json(savedPaymentOptions);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
);

export const getAllPaymentOptionsListController = asyncHandler(
  async (req, res, next) => {
    try {
      const paymentOptions = await PaymentOptionsModel.find({});
      res.status(200).json(paymentOptions);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
);
