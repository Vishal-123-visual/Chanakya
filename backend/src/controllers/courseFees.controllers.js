import mongoose from "mongoose";
import asyncHandler from "../middlewares/asyncHandler.js";
import admissionFormModel from "../models/addmission_form.models.js";
import CourseFeesModel from "../models/courseFees/courseFees.models.js";
import { USER_EMAIL } from "../config/config.js";
import { mailTransporter } from "../utils/mail_helpers.js";
import { MailHTML } from "../../helpers/mail/index.js";
import CourseModel from "../models/course/courses.models.js";
import PaymentInstallmentTimeExpireModel from "../models/NumberInstallmentExpireTime/StudentCourseFeesInstallments.models.js";
import PaymentOptionsModel from "../models/payment-options/paymentoption.models.js";
import CompanyModels from "../models/company/company.models.js";

export const createCourseFeesController = asyncHandler(
  async (req, res, next) => {
    //console.log(req.body);
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
      const student = await admissionFormModel
        .findById(studentInfo)
        .populate(["courseName", "companyName"]);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      //console.log(student);

      // generate the recipt number from
      let reciptNumber;
      if (student.companyName.reciptNumber) {
        reciptNumber = student.companyName.reciptNumber;
      }

      // Save course fees
      const newCourseFees = new CourseFeesModel({
        ...req.body,
        reciptNumber,
        companyName: student.companyName._id,
      });
      let reciptNumberString = Number(reciptNumber.split("-")[1]) + 1;
      const savedCourseFees = await newCourseFees.save();
      const currentCompany = await CompanyModels.findById(
        student.companyName._id
      );

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
      const findPaymentOptionName = await PaymentOptionsModel.findById(
        paymentOption
      );
      console.log(findPaymentOptionName);

      // Send email asynchronously

      sendEmail(
        `${req.user.email}, ${student.email} ${currentCompany.email},thakurarvindkr10@gmail.com`,
        "Regarding to Submitted Fees in Visual Media Technology",
        `Hello ${student.name} you have submitted fees `,
        `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Template</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
        
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 2px solid #000000; padding: 20px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
          <!-- Company Name and Logo -->
          <table style="width: 100%;">
            <tr>
              <td colspan="3" style="text-align: center;">
                <h3 style="margin: 0;">${currentCompany.companyName}</h3>
              </td>
            </tr>
            <tr>
              <td style="width: 33%; text-align: left;"><strong>Receipt No:</strong> ${
                savedCourseFees.reciptNumber
              }</td>
              <td style="width: 33%; text-align: center;"><strong>RECEIPT</strong></td>
              <td style="width: 33%; text-align: right;"><img src="http://localhost:8080/images/${
                currentCompany.logo
              }" alt="Company Logo" style="max-width: 100px;"></td>
            </tr>
          </table>
        
          <!-- Date and Payment Details -->
          <p style="margin-top: 20px;"><strong>Date:</strong> ${new Date().toDateString()}</p>
          <p><strong>Received Amount:</strong> ${amountPaid + lateFees}</p>
          <p><strong>Student Name:</strong> ${student.name}</p>
        
          <!-- Payment Breakdown -->
          <table style="width: 100%; margin-top: 20px;">
            <tr>
              <td style="width: 50%; text-align: left;">
                <p><strong>Course Fees:</strong> ${student.course_fees}</p>
                <p><strong>Late Fees:</strong> ${lateFees}</p>
                <p><strong>Total:</strong> ${amountPaid + lateFees}</p>
              </td>
              <td style="width: 50%; text-align: left;">
                <p><strong>Course Name:</strong> ${
                  student.courseName.courseName
                }</p>
                <p><strong>Payment By:</strong> ${
                  findPaymentOptionName.name
                }</p>
                <p><strong>Cash Amount:</strong> ${amountPaid}</p>
              </td>
            </tr>
          </table>
        
          <!-- Additional Notes -->
          <div style="margin-top: 20px;">
            <p><strong>Notes:</strong></p>
            <ul>
              <li>CHEQUES SUBJECT TO REALISATION THE RECEIPT MUST BE PRODUCED WHEN DEMANDED</li>
              <li>FEES ONCE PAID ARE NOT REFUNDABLE</li>
              <li>Auth. Franchisee of Big Animation (1) Pvt. Ltd</li>
            </ul>
          </div>
        
          <!-- Footer -->
          <footer style="text-align: center; margin-top: 20px;">
            <p>RELIANCE EDUCATION, SCO 114-115, Basement, Sector 34-A, Chandigarh.</p>
            <p>(M) +91-7696300600</p>
            <p><a href="http://www.relianceedu.com">www.relianceedu.com</a> | E-mail: <a href="mailto:chandigarh@relianceedu.com">chandigarh@relianceedu.com</a></p>
          </footer>
        
        </div>
        
        </body>
        </html>
        `
      );

      res.status(201).json(savedCourseFees);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Function to send email asynchronously
async function sendEmail(toEmails, subject, text, html) {
  const mailOptions = {
    from: USER_EMAIL,
    to: toEmails,
    subject: subject,
    text: text,
    html,
  };

  try {
    const result = await mailTransporter.sendMail(mailOptions);
    console.log("Email sent successfully", result);
  } catch (error) {
    console.log("Email send failed with error:", error);
  }
}

export const getCourseFeesByStudentIdController = asyncHandler(
  async (req, res, next) => {
    try {
      console.log(req.user.email, req.user.role);
      const { studentId } = req.params;
      //console.log(studentId);
      const studentFees = await CourseFeesModel.find({
        studentInfo: studentId,
      }).sort({ createdAt: 1 });
      if (!studentFees) {
        return res.status(404).json({ message: "Student fee not found" });
      }

      const studentInfo = await admissionFormModel
        .findById(studentId)
        .populate(["courseName", "companyName"]);
      //console.log("from ------------>", studentInfo);

      // now get next payment installment data
      let installmentExpireDate =
        studentInfo.no_of_installments_expireTimeandAmount;
      // const nextInstallmentExpireTimeData =
      //   await PaymentInstallmentTimeExpireModel.find({
      //     studentInfo: studentId,
      //     expiration_date: installmentExpireDate,
      //   });

      // console.log(
      //   "next installment fees",
      //   installmentExpireDate,
      //   nextInstallmentExpireTimeData
      // );

      //console.log("student info data ----------------> ", studentInfo);

      // // get the old time and current time
      let installmentPayTime = new Date(installmentExpireDate).getTime();
      let currentTimePaymentInstallment = new Date().getTime();

      if (installmentPayTime < currentTimePaymentInstallment) {
        let numberOfInstallment = studentInfo.no_of_installments;
        studentInfo.installmentPaymentSkipMonth += 1;
        if (numberOfInstallment > 0) {
          studentInfo.no_of_installments = numberOfInstallment - 1;
          studentInfo.no_of_installments_amount =
            studentInfo.remainingCourseFees / numberOfInstallment - 1;
        }
        await studentInfo.save();
      } else {
        let arrayOfCurrentTime = new Date(currentTimePaymentInstallment)
          .toDateString()
          .split(" ");
        let arrayOfPrevTime = new Date(installmentPayTime)
          .toDateString()
          .split(" ");
        let dayMonthDateYearCurrent =
          arrayOfCurrentTime[0] +
          arrayOfCurrentTime[1] +
          arrayOfCurrentTime[2] +
          arrayOfCurrentTime[3];
        let dayMonthDateYearPrev =
          arrayOfPrevTime[0] +
          arrayOfPrevTime[1] +
          arrayOfPrevTime[2] +
          arrayOfPrevTime[3];
        //console.log(dayMonthDateYearPrev);

        if (
          arrayOfCurrentTime[0] +
            arrayOfCurrentTime[1] +
            1 +
            arrayOfCurrentTime[3] ===
          dayMonthDateYearPrev
        ) {
          // then send mail to student
          sendEmail(
            `${req.user.email}, ${studentInfo.email}`,
            "Welcome to visual Media Technology",
            "Regarding to Fees Installment due in Visual Media Technology"
          );
        }

        if (
          arrayOfCurrentTime[0] +
            arrayOfCurrentTime[1] +
            10 +
            arrayOfCurrentTime[3] ===
          dayMonthDateYearPrev
        ) {
          // then send mail to student
          sendEmail();
        }
        if (
          arrayOfCurrentTime[0] +
            arrayOfCurrentTime[1] +
            12 +
            arrayOfCurrentTime[3] ===
          dayMonthDateYearPrev
        ) {
          // then send mail to student
          sendEmail();
        }
        if (
          arrayOfCurrentTime[0] +
            arrayOfCurrentTime[1] +
            15 +
            arrayOfCurrentTime[3] ===
          dayMonthDateYearPrev
        ) {
          // then send mail to student
          sendEmail();
        }
      }

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
