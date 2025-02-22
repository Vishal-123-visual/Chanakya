import { Router } from "express";
import { isAdmin, requireSignIn } from "../middlewares/auth.middleware.js";
import {
  createCourseFeesController,
  getAllCourseFeesController,
  getSingleStudentCourseFeesController,
  updateSingleStudentCourseFeesController,
  deleteSingleStudentCourseFeesController,
  getCourseFeesByStudentIdController,
  //getAllStudentCourseFeesNextInstallmentController,
  getCollectionFeesAccordingToCompanyIdController,
  createEaseBuzzCourseFeesController,
} from "../controllers/courseFees.controllers.js";
import admissionFormModel from "../models/addmission_form.models.js";
import CourseFeesModel from "../models/courseFees/courseFees.models.js";
import { FRONTEND_URL } from "../config/config.js";
import moment from "moment";
import CompanyModels from "../models/company/company.models.js";
import DayBookDataModel from "../models/day-book/DayBookData.models.js";
import StudentGST_GuggestionModel from "../models/email-remainder/Student.GST.Suggestion.js";
import PaymentInstallmentTimeExpireModel from "../models/NumberInstallmentExpireTime/StudentCourseFeesInstallments.models.js";
const router = Router();

router.post("/", requireSignIn, createCourseFeesController);

router.post(
  "/online-payment",
  requireSignIn,
  createEaseBuzzCourseFeesController
);

router.post("/payment/success", async (req, res) => {
  // console.log(req.body.addedon);
  try {
    const {
      firstname,
      amount,
      status,
      udf1,
      udf2,
      udf3,
      udf4,
      udf5,
      udf6,
      udf7,
      addedon,
      email,
      phone,
    } = req.body;
    // console.log(
    //   firstname,
    //   amount,
    //   status,
    //   udf1,
    //   udf2,
    //   udf3,
    //   udf4,
    //   udf5,
    //   udf6,
    //   udf7,
    //   addedon,
    //   email,
    //   phone
    // );
    // Fetch student details
    const student = await admissionFormModel
      .findOne({ email })
      .populate(["courseName", "companyName"]);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    // Save the payment details
    let reciptNumber;
    const currentCompany = await CompanyModels.findById(
      student.companyName._id
    );
    if (student.companyName.reciptNumber) {
      reciptNumber = student.companyName.reciptNumber;
    }
    const alreadyExistsReciptNumberInCourseFees = await CourseFeesModel.findOne(
      { reciptNumber: reciptNumber }
    );
    if (alreadyExistsReciptNumberInCourseFees) {
      // return res.status(404).json({
      //   success: false,
      //   error: `Already Exists this recipt number ${reciptNumber}.to solve this problem you have to increase the recipt number by 1 from manage company`,
      // });
      currentCompany.reciptNumber = `${reciptNumber?.split("-")[0]}-${
        Number(reciptNumber?.split("-")[1]) + 1
      }`;
      await currentCompany.save();
      reciptNumber = currentCompany.reciptNumber;
      // console.log(
      //   "current company recipt number ",
      //   currentCompany.reciptNumber
      // );
    }
    // console.log(userName);
    const newDayBookData = new DayBookDataModel({
      udf3: student._id,
      rollNo: student.rollNumber,
      StudentName: student.name,
      studentLateFees: +0,
      companyId: student?.companyName?._id,
      dayBookDatadate: moment(addedon, "YYYY-MM-DD HH:mm:ss").toDate(),
      reciptNumber,
      credit: +Number(amount),
      narration: "Paid By Easebuzz",
      addedBy: firstname,
    });
    await newDayBookData.save();
    const studentGSTStatus = await StudentGST_GuggestionModel.find();
    //console.log(studentGSTStatus[0].studentGST_Guggestion);
    let gstAmount =
      student.companyName.isGstBased === "Yes"
        ? (Number(amount) / (studentGSTStatus[0]?.gst_percentage + 100)) * 100
        : Number(amount);
    let cutGSTAmount = Number(amount) - gstAmount;
    //console.log("gst amount: " + gstAmount);
    if (Number(udf3) === 0 && student.installmentPaymentSkipMonth === 0) {
      student.remainingCourseFees = 0;
      student.no_of_installments_expireTimeandAmount = null;
      // Save course fees
      // console.log(req.user);
      const newCourseFees = new CourseFeesModel({
        netCourseFees: udf6,
        amountPaid: Number(amount),
        remainingFees: udf3,
        narration: "Paid By Easebuzz",
        paymentOption: udf7,
        studentInfo: udf1,
        lateFees: 0,
        no_of_installments_amount: udf5,
        no_of_installments: udf4,
        courseName: udf2,
        amountDate: moment(addedon, "YYYY-MM-DD HH:mm:ss").toDate(),
        reciptNumber,
        companyName: student.companyName._id,
        addedBy: firstname,
        gst_percentage: studentGSTStatus[0]?.gst_percentage,
      });
      const savedCourseFees = await newCourseFees.save();
      // const currentCompany = await CompanyModels.findById(
      //   student.companyName._id
      // );
      student.down_payment = Number(amount);
      student.remainingCourseFees = Number(udf3);
      student.totalPaid += Number(amount);
      student.no_of_installments = 0;
      await student.save();
      return res.status(200).json({
        status: true,
        message: "all course fees paid",
        id: student._id,
      });
    }
    // Save course fees
    const newCourseFees = new CourseFeesModel({
      netCourseFees: udf6,
      amountPaid: Number(amount),
      remainingFees: udf3,
      narration: "Paid By Easebuzz",
      paymentOption: udf7,
      studentInfo: udf1,
      lateFees: 0,
      no_of_installments_amount: udf5,
      no_of_installments: udf4,
      courseName: udf2,
      amountDate: moment(addedon, "YYYY-MM-DD HH:mm:ss").toDate(),
      reciptNumber,
      companyName: student.companyName._id,
      addedBy: firstname,
      gst_percentage: studentGSTStatus[0]?.gst_percentage,
    });

    // console.log(reciptNumber);
    let reciptNumberString = Number(reciptNumber?.split("-")[1]) + 1;
    const savedCourseFees = await newCourseFees.save();
    //console.log(reciptNumberString);
    currentCompany.reciptNumber =
      reciptNumber?.split("-")[0] + "-" + reciptNumberString;
    await currentCompany.save();
    //console.log("saved course fees", savedCourseFees);
    // Update student's payment information
    student.down_payment = Number(amount);
    student.remainingCourseFees = udf3;
    student.totalPaid += Number(amount);
    student.no_of_installments -= 1;
    // Calculate and store new installment expiration times
    let expirationDate = moment(addedon).toDate();
    const nextInstallment = Number(udf4) - 1;
    const installmentAmount = Math.floor(Number(udf3) / nextInstallment);
    //console.log("Installment amount :  ".installmentAmount);
    const lastPaymentInstallmentExpirationTime =
      await PaymentInstallmentTimeExpireModel.findOne({
        udf3,
      }).sort({ createdAt: -1 });
    if (lastPaymentInstallmentExpirationTime) {
      if (
        Number(lastPaymentInstallmentExpirationTime.installment_number) ===
        Number(udf4)
      ) {
        await lastPaymentInstallmentExpirationTime.deleteOne();
      }
    }
    // Create the entry for the current due installment
    // console.log(student);
    // console.log(req.body);
    const currentInstallmentExpiration = new PaymentInstallmentTimeExpireModel({
      udf3,
      companyName: student.companyName._id,
      courseName: student?.courseName?._id,
      expiration_date: expirationDate, // Set to current date
      installment_number: udf4, // Current installment number
      installment_amount: Number(amount),
    });
    expirationDate = moment(addedon).add(1, "months");
    // Create the entry for the next installment
    const nextInstallmentExpiration = new PaymentInstallmentTimeExpireModel({
      udf3,
      companyName: student.companyName._id,
      courseName: student?.courseName?._id,
      expiration_date: expirationDate.toDate(), // Convert moment object to Date
      installment_number: nextInstallment,
      installment_amount: installmentAmount,
    });
    await currentInstallmentExpiration.save();
    await nextInstallmentExpiration.save();
    student.no_of_installments_expireTimeandAmount = expirationDate.toDate(); // Convert moment object to Date
    student.no_of_installments_amount = installmentAmount;
    await student.save();
    res.redirect(`${FRONTEND_URL}/payment/success`);
  } catch (error) {
    console.error("❌ Error:", error);
    return res.status(500).json({
      message: "Payment processing failed",
      error: error.message || "Unknown Error",
    });
  }
});

// Failure URL
router.post("/payment/failure", async (req, res) => {
  try {
    const { email } = req.body;

    // console.log("route", req.body);

    // Fetch student details
    const student = await admissionFormModel.findOne({ email });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Log the failure
    // console.error("⚠️ Route:", student);

    // Redirect URL and failure message
    res.redirect(`${FRONTEND_URL}/payment/failure`);
  } catch (error) {
    console.error("❌ Error:", error);
    return res.status(500).json({
      message: "Payment processing failed",
      error: error.message || "Unknown Error",
    });
  }
});

router.get(
  "/paymentInstallmentFees/:companyId",
  requireSignIn,
  getCollectionFeesAccordingToCompanyIdController
);

router
  .route("/allCourseFess")
  .get(requireSignIn, isAdmin, getAllCourseFeesController);

router
  .route("/:id")
  .get(requireSignIn, getSingleStudentCourseFeesController)
  .put(requireSignIn, isAdmin, updateSingleStudentCourseFeesController)
  .delete(requireSignIn, isAdmin, deleteSingleStudentCourseFeesController);

router.get(
  "/studentFees/:studentId",
  requireSignIn,
  getCourseFeesByStudentIdController
);

export default router;
