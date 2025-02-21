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
const router = Router();

router.post("/", requireSignIn, createCourseFeesController);

router.post(
  "/online-payment",
  requireSignIn,
  createEaseBuzzCourseFeesController
);

// Success URL
router.post("/payment/success", async (req, res) => {
  try {
    const { txnid, amount, status, firstname, email, phone } = req.body;

    // Fetch student details
    const student = await admissionFormModel.findOne({ email });

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
      currentCompany.reciptNumber = `${reciptNumber.split("-")[0]}-${
        Number(reciptNumber.split("-")[1]) + 1
      }`;
      await currentCompany.save();
      reciptNumber = currentCompany.reciptNumber;
      // console.log(
      //   "current company recipt number ",
      //   currentCompany.reciptNumber
      // );
    }

    const userName =
      req.user.fName === req.user.lName
        ? req.user.fName
        : `${req.user.fName} ${req.user.lName}`;

    // console.log(userName);

    const newDayBookData = new DayBookDataModel({
      studentInfo: student._id,
      rollNo: student.rollNumber,
      StudentName: student.name,
      studentLateFees: +lateFees,
      companyId: student?.companyName?._id,
      dayBookDatadate: amountDate,
      reciptNumber,
      credit: +amountPaid,
      narration,
      addedBy: userName,
    });

    await newDayBookData.save();

    const studentGSTStatus = await StudentGST_GuggestionModel.find();
    //console.log(studentGSTStatus[0].studentGST_Guggestion);
    let gstAmount =
      student.companyName.isGstBased === "Yes"
        ? (Number(amountPaid) / (studentGSTStatus[0]?.gst_percentage + 100)) *
          100
        : Number(amountPaid);
    let cutGSTAmount = amountPaid - gstAmount;
    //console.log("gst amount: " + gstAmount);

    if (
      Number(req.body.remainingFees) === 0 &&
      student.installmentPaymentSkipMonth === 0
    ) {
      student.remainingCourseFees = 0;
      student.no_of_installments_expireTimeandAmount = null;
      // Save course fees
      // console.log(req.user);
      const newCourseFees = new CourseFeesModel({
        ...req.body,
        reciptNumber,
        companyName: student.companyName._id,
        addedBy: userName,
        gst_percentage: studentGSTStatus[0]?.gst_percentage,
      });

      const savedCourseFees = await newCourseFees.save();
      // const currentCompany = await CompanyModels.findById(
      //   student.companyName._id
      // );

      student.down_payment = amountPaid;
      student.remainingCourseFees = remainingFees;
      student.totalPaid += amountPaid;
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
      ...req.body,
      reciptNumber,
      companyName: student.companyName._id,
      addedBy: userName,
      gst_percentage: studentGSTStatus[0]?.gst_percentage,
    });
    let reciptNumberString = Number(reciptNumber.split("-")[1]) + 1;
    const savedCourseFees = await newCourseFees.save();

    //console.log(reciptNumberString);

    currentCompany.reciptNumber =
      reciptNumber.split("-")[0] + "-" + reciptNumberString;
    await currentCompany.save();

    //console.log("saved course fees", savedCourseFees);

    // Update student's payment information
    student.down_payment = amountPaid;
    student.remainingCourseFees = remainingFees;
    student.totalPaid += amountPaid;
    student.no_of_installments -= 1;

    // Calculate and store new installment expiration times
    let expirationDate = moment(amountDate).toDate();

    const nextInstallment = Number(req.body.no_of_installments) - 1;
    const installmentAmount = Math.floor(
      Number(req.body.remainingFees) / nextInstallment
    );

    //console.log("Installment amount :  ".installmentAmount);
    const lastPaymentInstallmentExpirationTime =
      await PaymentInstallmentTimeExpireModel.findOne({
        studentInfo,
      }).sort({ createdAt: -1 });

    if (lastPaymentInstallmentExpirationTime) {
      if (
        Number(lastPaymentInstallmentExpirationTime.installment_number) ===
        Number(req.body.no_of_installments)
      ) {
        await lastPaymentInstallmentExpirationTime.deleteOne();
      }
    }

    // Create the entry for the current due installment
    // console.log(student);
    // console.log(req.body);
    const currentInstallmentExpiration = new PaymentInstallmentTimeExpireModel({
      studentInfo,
      companyName: student.companyName._id,
      courseName: student?.courseName?._id,
      expiration_date: expirationDate, // Set to current date
      installment_number: req.body.no_of_installments, // Current installment number
      installment_amount: amountPaid,
    });
    expirationDate = moment(amountDate).add(1, "months");

    // Create the entry for the next installment
    const nextInstallmentExpiration = new PaymentInstallmentTimeExpireModel({
      studentInfo,
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

    return res.status(200).json({ message: "Payment successful" });
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
    const { txnid, amount, status, firstname, email, phone } = req.body;

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
