import asyncHandler from "../middlewares/asyncHandler.js";
import EmailSuggestionModel from "../models/email-remainder/EmailSuggestions.models.js";
import EmailRemainderModel from "../models/email-remainder/email.remainder.models.js";

export const addEmailRemainderController = asyncHandler(
  async (req, res, next) => {
    const { firstRemainder, secondRemainder, thirdRemainder } = req.body;
    try {
      if (!firstRemainder) {
        return res.status(400).json({
          error: "All fields are required",
        });
      } else if (!secondRemainder) {
        return res.status(400).json({
          error: "All fields are required",
        });
      } else if (!thirdRemainder) {
        return res.status(400).json({
          error: "All fields are required",
        });
      }

      const emailsTexts = await EmailRemainderModel.find({});
      emailsTexts.forEach(async (emailsText) => await emailsText.deleteOne());

      const emailRemainder = new EmailRemainderModel({
        firstRemainder,
        secondRemainder,
        thirdRemainder,
      });
      await emailRemainder.save();
      res.status(200).json({ message: "Email Remainder Added" });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
);

export const addEmailSuggestionController = asyncHandler(
  async (req, res, next) => {
    try {
      const { emailSuggestionStatus } = req.body;
      //console.log(emailSuggestionStatus);
      const emailRemainder = await EmailSuggestionModel.find({});
      emailRemainder.forEach(
        async (emailRemainder) => await emailRemainder.deleteOne()
      );
      const emailSuggestion = new EmailSuggestionModel({
        emailSuggestionStatus,
      });
      await emailSuggestion.save();
      res.status(200).json({ message: "Email Suggestion Added" });
    } catch (error) {
      console.log(error);
    }
  }
);
export const getEmailSuggestionController = asyncHandler(
  async (req, res, next) => {
    try {
      const emailSuggestions = await EmailSuggestionModel.find({});
      res.status(200).json({ emailSuggestions });
    } catch (error) {
      console.log(error);
    }
  }
);
