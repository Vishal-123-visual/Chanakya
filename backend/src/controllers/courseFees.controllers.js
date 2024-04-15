import mongoose from "mongoose";
import asyncHandler from "../middlewares/asyncHandler.js";
import admissionFormModel from "../models/addmission_form.models.js";
import CourseFeesModel from "../models/courseFees/courseFees.models.js";
import { USER_EMAIL } from "../config/config.js";
import { mailTransporter } from "../utils/mail_helpers.js";

export const createCourseFeesController = asyncHandler(
  async (req, res, next) => {
    //console.log(req.body);
    try {
      let {
        studentInfo,
        remainingFees,
        amountPaid,
        amountDate,
        lateFees,
        paymentOption,
      } = req.body;

      //console.log(req.body);

      // Validate required fields
      if (
        !amountPaid ||
        !amountDate ||
        !studentInfo
        //!remainingFees
      ) {
        return res.status(400).json({ message: "Required fields are missing" });
      }
      //console.log(req.body);

      // Calculate new netCourseFees
      const student = await admissionFormModel.findById(studentInfo);
      const newNetCourseFees = remainingFees;
      if (newNetCourseFees < 0) {
        return res
          .status(400)
          .json({ message: "Amount paid exceeds remaining course fees" });
      }

      // Save course fees
      const newCourseFees = new CourseFeesModel({ ...req.body });
      const savedCourseFees = await newCourseFees.save();

      const mailOptions = {
        from: USER_EMAIL,
        to: "thakurarvindkr10@gmail.com, thakurarvindk10@gmail.com",
        subject: "Welcome to Visual Media Technolog",
        text: "This is an test email from Visual Media",
      };

      try {
        const result = await mailTransporter.sendMail(mailOptions);
        console.log("Email sent successfully", result);
      } catch (error) {
        console.log("Email send failed with error:", error);
      }

      // Update student's down_payment and netCourseFees
      student.down_payment = amountPaid;
      // student.netCourseFees = newNetCourseFees;
      student.remainingCourseFees = remainingFees;
      student.totalPaid += amountPaid;
      await student.save();

      res.status(201).json(savedCourseFees);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// export const getAllCourseFeesController = asyncHandler(
//   async (req, res, next) => {
//     try {
//       console.log(req.body);
//       const courseFees = await CourseFeesModel.find({}).populate([
//         "studentInfo",
//       ]);
//       res.status(200).json(courseFees);
//     } catch (error) {
//       res.status(500).json({ error: error });
//     }
//   }
// );

export const getCourseFeesByStudentIdController = asyncHandler(
  async (req, res, next) => {
    try {
      const { studentId } = req.params;
      //console.log(studentId);
      const studentFees = await CourseFeesModel.find({
        studentInfo: studentId,
      }).sort({ createdAt: 1 });
      if (!studentFees) {
        return res.status(404).json({ message: "Student fee not found" });
      }
      //console.log(studentFees);
      res.status(200).json(studentFees);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
);

export const getSingleStudentCourseFeesController = asyncHandler(
  async (req, res, next) => {
    try {
      const courseFees = await CourseFeesModel.findById(req.params.id).populate(
        ["courseName", "studentInfo", "PaymentOptions"]
      );

      if (!courseFees) {
        return res.status(404).json({ message: "Student fee not found" });
      }
      res.status(200).json(courseFees);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
);

export const updateSingleStudentCourseFeesController = asyncHandler(
  async (req, res, next) => {
    const {
      netCourseFees,
      studentInfo,
      remainingFees,
      amountPaid,
      amountDate,
      paymentOption,
      lateFees,
      reciptNumber,
    } = req.body;

    try {
      const singleStudentFee = await CourseFeesModel.findById(req.params.id);
      if (!singleStudentFee) {
        return res.status(404).json({ message: "Student fee not found" });
      }
      singleStudentFee.netCourseFees =
        netCourseFees || singleStudentFee.netCourseFees;
      singleStudentFee.studentInfo =
        studentInfo || singleStudentFee.studentInfo;
      singleStudentFee.remainingFees =
        remainingFees || singleStudentFee.remainingFees;
      singleStudentFee.amountPaid = amountPaid || singleStudentFee.amountPaid;
      singleStudentFee.amountDate = amountDate || singleStudentFee.amountDate;
      singleStudentFee.paymentOption =
        paymentOption || singleStudentFee.paymentOption;
      singleStudentFee.lateFees = lateFees || singleStudentFee.lateFees;
      singleStudentFee.reciptNumber =
        reciptNumber || singleStudentFee.reciptNumber;
      let updatedSingleStudentFee = await singleStudentFee.save();
      res.status(200).json(updatedSingleStudentFee);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

export const deleteSingleStudentCourseFeesController = asyncHandler(
  async (req, res, next) => {
    try {
      console.log(req.params.id);
      const singleStudentFee = await CourseFeesModel.findById(req.params.id);
      if (!singleStudentFee) {
        return res.status(404).json({ message: "Student fee not found" });
      }
      console.log(singleStudentFee);
      await singleStudentFee.deleteOne();
      res.status(200).json({ message: "Student fee deleted" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);
