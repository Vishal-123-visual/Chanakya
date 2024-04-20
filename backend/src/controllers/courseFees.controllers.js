import mongoose from "mongoose";
import asyncHandler from "../middlewares/asyncHandler.js";
import admissionFormModel from "../models/addmission_form.models.js";
import CourseFeesModel from "../models/courseFees/courseFees.models.js";
import { USER_EMAIL } from "../config/config.js";
import { mailTransporter } from "../utils/mail_helpers.js";
import { MailHTML } from "../../helpers/mail/index.js";
import CourseModel from "../models/course/courses.models.js";
import PaymentInstallmentTimeExpireModel from "../models/NumberInstallmentExpireTime/StudentCourseFeesInstallments.models.js";

export const createCourseFeesController = asyncHandler(
  async (req, res, next) => {
    console.log(req.body);
    try {
      const {
        studentInfo,
        remainingFees,
        amountPaid,
        amountDate,
        lateFees,
        paymentOption,
      } = req.body;

      // Validate required fields
      if (!amountPaid || !amountDate || !studentInfo) {
        return res.status(400).json({ message: "Required fields are missing" });
      }

      // Fetch student and validate remaining fees
      const student = await admissionFormModel.findById(studentInfo);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      // Save course fees
      const newCourseFees = new CourseFeesModel({ ...req.body });
      const savedCourseFees = await newCourseFees.save();

      // Update student's payment information
      student.down_payment = amountPaid;
      student.remainingCourseFees = remainingFees;
      student.totalPaid += amountPaid;
      student.no_of_installments -= 1;

      // Calculate and store new installment expiration times
      let expirationDate = new Date();
      if (student.no_of_installments_expireTimeandAmount) {
        // Get the expiration date of the last installment
        const lastExpirationDate = new Date(
          student.no_of_installments_expireTimeandAmount
        );
        // Set the expiration date of the next installment to be one month after the last one
        expirationDate = new Date(lastExpirationDate);
        expirationDate.setMonth(expirationDate.getMonth() + 1);
      } else {
        // If there are no previous installments, set the expiration date to be one month from now
        expirationDate.setMonth(expirationDate.getMonth() + 1);
      }

      const nextInstallment = Number(req.body.no_of_installments) - 1;

      const installmentExpiration = new PaymentInstallmentTimeExpireModel({
        studentInfo,
        courseName: req.body.courseName,
        expiration_date: expirationDate,
        installment_number: nextInstallment,
        installment_amount: Number(
          Math.floor(Number(req.body.remainingFees)) / nextInstallment
        ),
      });

      await installmentExpiration.save();

      student.no_of_installments_expireTimeandAmount = expirationDate;

      await student.save();

      // Send email asynchronously
      sendEmail();

      res.status(201).json(savedCourseFees);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Function to send email asynchronously
async function sendEmail() {
  const mailOptions = {
    from: USER_EMAIL,
    to: "thakurarvindkr10@gmail.com, cepelon828@kravify.com",
    subject: "Welcome to Visual Media Technolog",
    text: "This is a test email from Visual Media",
    html: ` <body style="font-family: Arial, sans-serif; margin: 0; padding: 0">
   <div
     style="
       max-width: 768px;
       margin: 0 auto;
       background-color: #7da7e1;
       border: 2px solid #000;
       padding: 20px;
       box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
     "
   >
     <h3 style="text-align: center">Visual Media Technology</h3>
     <header
       style="
         display: flex;
         justify-content: space-between;
         align-items: center;
       "
     >
       <p>Receipt No 123</p>
       <p>RECEIPT</p>
       <img
         src="https://www.relanimation.in/wp-content/uploads/2023/05/cropped-Reliance-logo.png"
         alt="logo"
         style="width: 100px"
       />
     </header>
     <p>Date 17/04/2023</p>
     <p>Received a sum of Rupees : 30000</p>
     <p>Mr./Mrs./Ms : Ajay</p>
     <section style="display: flex; justify-content: space-around">
       <div class="left" style="font-size: 16px; font-weight: 600">
         <p>Course Fees : 50000</p>
         <p>Late Fees : 0</p>
         <p>Total : 3000</p>
       </div>
       <div class="right" style="font-size: 16px; font-weight: 600">
         <p>Course Name : Digital Marketing</p>
         <p>Payment By : Cash</p>
         <p>Cash Amount : 3000</p>
       </div>
     </section>
     <section
       style="
         display: flex;
         justify-content: space-around;
         font-size: 12px;
         font-weight: 300;
       "
     >
       <p>
         CHEQUES SUBJECT TO REALISATION THE RECEIPT MUST BE PRODUCED WHEN
         DEMANDED
       </p>
       <p>FEES ONCE PAID ARE NOT REFUNDABLE</p>
       <p>Auth. Franchisee of Big Animation (1) Pvt. Ltd</p>
     </section>
     <footer style="text-align: center; margin-top: 20px">
       <p>
         RELIANCE EDUCATION, SCO 114-115, Basement, Sector 34-A, Chandigarh.
         (M) +91-7696300600
       </p>
       <p>www.relianceedu.com E-mail: chandigarh@relianceedu.com</p>
     </footer>
   </div>
 </body>`,
  };

  try {
    const result = await mailTransporter.sendMail(mailOptions);
    //console.log("Email sent successfully", result);
  } catch (error) {
    console.log("Email send failed with error:", error);
  }
}

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

export const getAllCourseFeesController = asyncHandler(
  async (req, res, next) => {
    try {
      // const allCourseFees = await CourseFeesModel.find({})
      //   .populate(["studentInfo", "courseName"])
      //   .sort("courseName");
      const nextInstallmentCourseFees =
        await PaymentInstallmentTimeExpireModel.find({})
          .populate(["studentInfo", "courseName"])
          .sort("courseName");
      //console.log(nextInstallmentCourseFees);
      res.status(200).json(nextInstallmentCourseFees);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// {
//   "_id": "661a374ae78c47616b93557e",
//   "courseName": "Digital Marketing",
//   "courseFees": 40000,
//   "courseType": "65f2a48cd8b6fc856a36a192",
//   "numberOfYears": "660402aa2b8b76432d3dcfb1",
//   "category": "6618f56785f0da6d6281dcd2",
//   "user": "65deeeb6c0d01ccd202d6a1a",
//   "createdBy": "Rahul Roy",
//   "createdAt": "2024-04-13T07:42:02.778Z",
//   "updatedAt": "2024-04-13T07:42:02.778Z",
//   "__v": 0
// }
