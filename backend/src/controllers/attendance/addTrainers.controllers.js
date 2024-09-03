import trainerFormModel from "../../models/attendance/trainer.models.js";
import path from "path";
import fs from "fs";

export const addTrainerDataController = async (req, res, next) => {
  try {
    const { trainerName, trainerDesignation, trainerEmail, companyId } =
      req.body;

    if (!trainerName || !trainerDesignation || !trainerEmail) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Multer will store the file in req.file
    const trainerImage = req.file ? req.file.filename : null;

    if (!trainerImage) {
      return res.status(400).json({ message: "Trainer image is required" });
    }

    // Check if a trainer with the same email already exists
    const existingTrainer = await trainerFormModel.findOne({ trainerEmail });
    if (existingTrainer) {
      return res.status(400).json({ message: "Trainer already exists" });
    }

    // Create a new trainer record
    const newTrainer = new trainerFormModel({
      trainerImage,
      trainerName,
      trainerDesignation,
      trainerEmail,
      companyId,
    });

    await newTrainer.save();
    res
      .status(201)
      .json({ success: true, message: "Trainer Has Been Created !!" });
  } catch (error) {
    console.error("Error creating trainer:", error); // Improved logging
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error !!" });
  }
};

export const getAllTrainersDataController = async (req, res, next) => {
  try {
    // console.log("Request body:", req.body);
    const trainers = await trainerFormModel.find({}).populate("trainerImage");
    res.status(200).json({ trainers });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error !!" });
  }
};

export const getSingleTrainerDataByIdController = async (req, res, next) => {
  try {
    // console.log(req.params);
    const { id } = req.params;
    const trainer = await trainerFormModel
      .findById(id)
      .populate("trainerImage");
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }
    res.status(200).json({ trainer });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error !!" });
  }
};

export const updateSingleTrainerDataByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { trainerName, trainerDesignation, trainerEmail } = req.body;

    const trainer = await trainerFormModel.findById(id);
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    // Update trainer information
    trainer.trainerName = trainerName || trainer.trainerName;
    trainer.trainerDesignation =
      trainerDesignation || trainer.trainerDesignation;
    trainer.trainerEmail = trainerEmail || trainer.trainerEmail;

    // Check if a new image file is provided
    if (req.file) {
      // Delete old image if it exists
      if (trainer.trainerImage) {
        const oldImagePath = path.join(
          __dirname,
          "uploads",
          trainer.trainerImage
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          console.log("Old image deleted:", oldImagePath);
        } else {
          console.log("Old image not found:", oldImagePath);
        }
      }
    }

    // Save updated trainer
    await trainer.save();
    res.status(200).json({
      success: true,
      message: "Trainer updated successfully",
      trainer,
    });
  } catch (error) {
    console.error("Error updating trainer data:", error);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error !!" });
  }
};

export const deleteSingleTrainerByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const trainer = await trainerFormModel.findById(id);
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }
    await trainer.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Trainer deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error !!" });
  }
};
