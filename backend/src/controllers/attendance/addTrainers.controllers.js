import trainerFormModel from "../../models/attendance/trainer.models.js";

export const addTrainerDataController = async (req, res, next) => {
  try {
    // console.log(req.body);
    const { trainerImage, trainerName, trainerDesignation, trainerEmail } =
      req.body;
    const trainer = await trainerFormModel.findOne({ trainerEmail });
    if (trainer) {
      return res.status(400).json({ message: "Trainer already exists" });
    }
    const newTrainer = new trainerFormModel({
      trainerImage,
      trainerName,
      trainerDesignation,
      trainerEmail,
    });
    await newTrainer.save();
    res
      .status(201)
      .json({ success: true, message: "Trainer Has Been Created !!" });
  } catch (error) {
    res
      .status(500)
      .json({ success: true, message: "Internal Server Error !!" });
  }
};
