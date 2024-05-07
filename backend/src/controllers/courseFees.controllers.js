import mongoose from "mongoose";
import asyncHandler from "../middlewares/asyncHandler.js";
import admissionFormModel from "../models/addmission_form.models.js";
import CourseFeesModel from "../models/courseFees/courseFees.models.js";
import { BACKEND_URL, USER_EMAIL } from "../config/config.js";
import { mailTransporter } from "../utils/mail_helpers.js";
import { MailHTML } from "../../helpers/mail/index.js";
import CourseModel from "../models/course/courses.models.js";
import PaymentInstallmentTimeExpireModel from "../models/NumberInstallmentExpireTime/StudentCourseFeesInstallments.models.js";
import PaymentOptionsModel from "../models/payment-options/paymentoption.models.js";
import CompanyModels from "../models/company/company.models.js";

export const createCourseFeesController = asyncHandler(
  async (req, res, next) => {
    //console.log("from create course fees ->>>>", req.body);
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

      console.log(student);

      // generate the recipt number from
      let reciptNumber;
      if (student.companyName.reciptNumber) {
        reciptNumber = student.companyName.reciptNumber;
      }

      if (
        Number(req.body.remainingFees) === 0 &&
        student.installmentPaymentSkipMonth === 0
      ) {
        student.remainingCourseFees = 0;
        // Save course fees
        const newCourseFees = new CourseFeesModel({
          ...req.body,
          reciptNumber,
          companyName: student.companyName._id,
        });

        const savedCourseFees = await newCourseFees.save();
        // const currentCompany = await CompanyModels.findById(
        //   student.companyName._id
        // );

        student.down_payment = amountPaid;
        student.remainingCourseFees = remainingFees;
        student.totalPaid += amountPaid;
        student.no_of_installments -= 1;
        const findPaymentOptionName = await PaymentOptionsModel.findById(
          paymentOption
        );
        //console.log(findPaymentOptionName);
        // Send email asynchronously
        sendEmail(
          `${req.user.email}, ${student.email} ${student.companyName.email},thakurarvindkr10@gmail.com`,
          "Regarding to Submitted Fees in Visual Media Technology",
          `Hello ${student.name} you have submitted fees `,
          `<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8" />
  <meta http-equiv="x-ua-compatible" content="ie=edge" />
  <title>Email Receipt</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style type="text/css">
    /**
           * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
           */
    @media screen {
      @font-face {
        font-family: "Source Sans Pro";
        font-style: normal;
        font-weight: 400;
        src: local("Source Sans Pro Regular"), local("SourceSansPro-Regular"),
          url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format("woff");
      }

      @font-face {
        font-family: "Source Sans Pro";
        font-style: normal;
        font-weight: 700;
        src: local("Source Sans Pro Bold"), local("SourceSansPro-Bold"),
          url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format("woff");
      }
    }

    /**
           * Avoid browser level font resizing.
           * 1. Windows Mobile
           * 2. iOS / OSX
           */
    body,
    table,
    td,
    a {
      -ms-text-size-adjust: 100%;
      /* 1 */
      -webkit-text-size-adjust: 100%;
      /* 2 */
    }

    /**
           * Remove extra space added to tables and cells in Outlook.
           */
    table,
    td {
      mso-table-rspace: 0pt;
      mso-table-lspace: 0pt;
    }

    /**
           * Better fluid images in Internet Explorer.
           */
    img {
      -ms-interpolation-mode: bicubic;
    }

    /**
           * Remove blue links for iOS devices.
           */
    a[x-apple-data-detectors] {
      font-family: inherit !important;
      font-size: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
      color: inherit !important;
      text-decoration: none !important;
    }

    /**
           * Fix centering issues in Android 4.4.
           */
    div[style*="margin: 16px 0;"] {
      margin: 0 !important;
    }

    body {
      width: 100% !important;
      height: 100% !important;
      padding: 0 !important;
      margin: 0 !important;
    }

    /**
           * Collapse table borders to avoid space between cells.
           */
    table {
      border-collapse: collapse !important;
    }

    a {
      color: #1a82e2;
    }

    img {
      height: auto;
      line-height: 100%;
      text-decoration: none;
      border: 0;
      outline: none;
    }
  </style>
</head>

<body style="background-color: #d2c7ba">
  <!-- start preheader -->
  <div class="preheader" style="
                display: none;
                max-width: 0;
                max-height: 0;
                overflow: hidden;
                font-size: 1px;
                line-height: 1px;
                color: #fff;
                opacity: 0;
              ">
    A preheader is the short summary text that follows the subject line when
    an email is viewed in the inbox.
  </div>
  <!-- end preheader -->

  <!-- start body -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <!-- start logo -->
    <tr>
      <td align="center" bgcolor="#D2C7BA">
        <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
          <tr>
            <td align="center" valign="top" style="padding: 36px 24px">
              <a href="https://sendgrid.com" target="_blank" style="display: inline-block">
                <img src="./img/paste-logo-light@2x.png" alt="Logo" border="0" width="48" style="
                              display: block;
                              width: 48px;
                              max-width: 48px;
                              min-width: 48px;
                            " />
              </a>
            </td>
          </tr>
        </table>
        <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
      </td>
    </tr>
    <!-- end logo -->

    <!-- start hero -->
    <tr>
      <td align="center" bgcolor="#D2C7BA">
        <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
          <tr>
            <td align="left" bgcolor="#ffffff" style="
                          padding: 36px 24px 0;
                          font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                          border-top: 3px solid #d4dadf;
                        ">
              <h1 style="
                            margin: 0;
                            font-size: 32px;
                            font-weight: 700;
                            letter-spacing: -1px;
                            line-height: 48px;
                          ">
                Thank you for your Fees Submit ${student.name}!
              </h1>
            </td>
          </tr>
        </table>
        <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
      </td>
    </tr>
    <!-- end hero -->
    <!-- start student info block -->
<tr>
<td align="center" bgcolor="#D2C7BA" valign="top" width="100%">
<table align="center" bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" width="100%"
  style="max-width: 600px">
  <tr>
    <td align="center" valign="top" style="font-size: 0;">

      <div style="
                        display: inline-block;
                        width: 100%;
                        max-width: 50%;
                        min-width: 240px;
                        vertical-align: top;
                      ">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 300px" cellspacing="0">
          <tr>
            <td valign="top" style="
                              padding-left: 36px;
                              font-family: 'Source Sans Pro', Helvetica, Arial,
                                sans-serif;
                              font-size: 16px;
                            ">
              <p><strong>Student Name</strong></p>
              <p><strong>Father Name</strong></p>
              <p><strong>Father Phone Number</strong></p>
              <p><strong>Roll Number</strong></p>
              <p><strong>Course Name</strong></p>
              <p><strong>Payment Method</strong></p>
              <p><strong>Academy Name</strong></p>

            </td>
          </tr>
        </table>
      </div>
      <div style="
                        display: inline-block;
                        width: 100%;
                        max-width: 50%;
                        min-width: 240px;
                        vertical-align: top;
                      ">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 300px" cellspacing="0">
          <tr>
            <td valign="top" style="
                              font-family: 'Source Sans Pro', Helvetica, Arial,
                                sans-serif;
                              font-size: 16px;
                              
                            ">
              <p>${student.name}</p>
              <p>
                ${student.father_name}
              </p>
              <p>
                +91 ${student.mobile_number}
                </p>
                <p>
                ${student.rollNumber}
              </p>
              <p>
              ${student.courseName.courseName} 
              </p>
              <p>
              ${findPaymentOptionName.name}
              </p>
              <p>
                ${student.companyName.companyName}
              </p>
            </td>
           
          </tr>
        </table>
      </div>
    </td>
  </tr>
</table>
</td>
</tr>
<!-- end student info block -->


    <!-- start copy block -->
    <tr>
      <td align="center" bgcolor="#D2C7BA">
        <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
          <!-- start copy -->
          <tr>
            <td align="left" bgcolor="#ffffff" style="
                          padding: 24px;
                          font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                          font-size: 16px;
                          line-height: 24px;
                        ">
              <p style="margin: 0">
                Here is a summary of your recent recipt. If you have any
                questions or concerns about your order, please
                <a href="https://sendgrid.com">contact us</a>.
              </p>
            </td>
          </tr>
          <!-- end copy -->

          <!-- start receipt table -->
          <tr>
            <td align="left" bgcolor="#ffffff" style="
                          padding: 24px;
                          font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                          font-size: 16px;
                          line-height: 24px;
                        ">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="left" bgcolor="#D2C7BA" width="75%" style="
                                padding: 12px;
                                font-family: 'Source Sans Pro', Helvetica, Arial,
                                  sans-serif;
                                font-size: 16px;
                                line-height: 24px;
                              ">
                    <strong>Recipt No</strong>
                  </td>
                  <td align="left" bgcolor="#D2C7BA" width="25%" style="
                                padding: 12px;
                                font-family: 'Source Sans Pro', Helvetica, Arial,
                                  sans-serif;
                                font-size: 16px;
                                line-height: 24px;
                              ">
                    <strong>${student.companyName.reciptNumber}</strong>
                  </td>
                </tr>
               

                <tr>
                  <td align="left" width="75%" style="
                                padding: 6px 12px;
                                font-family: 'Source Sans Pro', Helvetica, Arial,
                                  sans-serif;
                                font-size: 16px;
                                line-height: 24px;
                              ">
                    Course Fees
                  </td>
                  <td align="left" width="25%" style="
                                padding: 6px 12px;
                                font-family: 'Source Sans Pro', Helvetica, Arial,
                                  sans-serif;
                                font-size: 16px;
                                line-height: 24px;
                              ">
                    ${student.courseName.courseFees} Rs
                  </td>
                </tr>

                
                <tr>
                  <td align="left" width="75%" style="
                                padding: 6px 12px;
                                font-family: 'Source Sans Pro', Helvetica, Arial,
                                  sans-serif;
                                font-size: 16px;
                                line-height: 24px;
                              ">
                    Fees Paid
                  </td>
                  <td align="left" width="25%" style="
                                padding: 6px 12px;
                                font-family: 'Source Sans Pro', Helvetica, Arial,
                                  sans-serif;
                                font-size: 16px;
                                line-height: 24px;
                              ">
                    ${student.down_payment} Rs
                  </td>
                </tr>




                <tr>
                  <td align="left" width="75%" style="
                          padding: 6px 12px;
                          font-family: 'Source Sans Pro', Helvetica, Arial,
                            sans-serif;
                          font-size: 16px;
                          line-height: 24px;
                        ">
                    Late Fees
                  </td>
                  <td align="left" width="25%" style="
                          padding: 6px 12px;
                          font-family: 'Source Sans Pro', Helvetica, Arial,
                            sans-serif;
                          font-size: 16px;
                          line-height: 24px;
                        ">
                    ${lateFees} Rs
                  </td>
                </tr>
                <tr>
                  <td align="left" width="75%" style="
                          padding: 6px 12px;
                          font-family: 'Source Sans Pro', Helvetica, Arial,
                            sans-serif;
                          font-size: 16px;
                          line-height: 24px;
                        ">
                    GST (${student.companyName.gst} %)
                  </td>
                  <td align="left" width="25%" style="
                          padding: 6px 12px;
                          font-family: 'Source Sans Pro', Helvetica, Arial,
                            sans-serif;
                          font-size: 16px;
                          line-height: 24px;
                        ">
                        ${(
                          ((Number(lateFees) + Number(student.down_payment)) *
                            Number(student.companyName.gst)) /
                          100
                        ).toFixed(2)} Rs.
                  </td>
                </tr>
               
                <tr style='border:2px dotted black;'>
                  <td align="left" width="75%" style="
                          padding: 6px 12px;
                          font-family: 'Source Sans Pro', Helvetica, Arial,
                            sans-serif;
                          font-size: 16px;
                          line-height: 24px;
                        ">
                    Total Amount
                  </td>
                  <td align="left" width="25%" style="
                          padding: 6px 12px;
                          font-family: 'Source Sans Pro', Helvetica, Arial,
                            sans-serif;
                          font-size: 16px;
                          line-height: 24px;
                        ">
                    ${(
                      Number(lateFees) +
                      Number(student.down_payment) +
                      ((Number(lateFees) + Number(student.down_payment)) *
                        Number(student.companyName.gst)) /
                        100
                    ).toFixed(2)} Rs
                  </td>
                </tr>

                <!-- end reeipt table -->
              </table>
              <!--[if (gte mso 9)|(IE)]>
                    </td>
                    </tr>

                  

                </table>
                <![endif]-->
            </td>
          </tr>
          <!-- end copy block -->

          <!-- start 1 copy block -->
          <!-- end copy block -->

          <!-- start receipt address block -->
          <tr>
            <td align="center" bgcolor="#D2C7BA" valign="top" width="100%">
              <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
              <table align="center" bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" width="100%"
                style="max-width: 600px">
                <tr>
                  <td align="center" valign="top" style="font-size: 0; border-bottom: 3px solid #d4dadf">
                    <!--[if (gte mso 9)|(IE)]>
                      <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                      <tr>
                      <td align="left" valign="top" width="300">
                      <![endif]-->
                   
                    <!--[if (gte mso 9)|(IE)]>
                      </td>
                      <td align="center" valign="top" width="100%">
                      <![endif]-->
                    <div style="
                            display: inline-block;
                            width: 100%;
                            max-width: 50%;
                            min-width: 240px;
                            vertical-align: top;
                          ">
                      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
                        style="max-width: 300px">
                        <tr>
                          <td align="center" valign="top" style="
                                  padding-bottom: 36px;
                                  padding-left: 36px;
                                  font-family: 'Source Sans Pro', Helvetica, Arial,
                                    sans-serif;
                                  font-size: 16px;
                                  line-height: 24px;
                                ">
                           
                            
                              ${student.companyName.companyAddress}
                            
                          </td>
                        </tr>
                      </table>
                    </div>
                    <!--[if (gte mso 9)|(IE)]>
                      </td>
                      </tr>
                      </table>
                      <![endif]-->
                  </td>
                </tr>
              </table>
              <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
            </td>
          </tr>
          <!-- end receipt address block -->

          <!-- start footer -->
          <tr>
            <td align="center" bgcolor="#D2C7BA" style="padding: 24px">
              <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
                <!-- start permission -->
                <tr>
                  <td align="center" bgcolor="#D2C7BA" style="
                          padding: 12px 24px;
                          font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                          font-size: 14px;
                          line-height: 20px;
                          color: #666;
                        ">
                        <p>
                        CHEQUES SUBJECT TO REALISATION THE RECEIPT MUST BE PRODUCED WHEN
                        DEMANDED
                      </p>
                      <p>FEES ONCE PAID ARE NOT REFUNDABLE</p>
                      <p>Auth. Franchisee of Big Animation (1) Pvt. Ltd</p>
                    
                  </td>
                </tr>
                <!-- end permission -->

                <!-- start unsubscribe -->
                <tr>
                  <td align="center" bgcolor="#D2C7BA" style="
                          padding: 12px 24px;
                          font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                          font-size: 14px;
                          line-height: 20px;
                          color: #666;
                        ">
                    <p style="margin: 0">
                      To stop receiving these emails, you can
                      <a href="https://sendgrid.com" target="_blank">unsubscribe</a>
                      at any time.
                    </p>
                   
                    <p>www.relianceedu.com E-mail: chandigarh@relianceedu.com</p>
                  </td>
                </tr>
                <!-- end unsubscribe -->
              </table>
              <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
            </td>
          </tr>
          <!-- end footer -->
        </table>
        <!-- end body -->
</body>

</html>`
        );

        await student.save();
        return res.status(200).json({ message: "all course fees paid" });
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
      // console.log(findPaymentOptionName);
      // Send email asynchronously
      sendEmail(
        `${req.user.email}, ${student.email} ${student.companyName.email},thakurarvindkr10@gmail.com`,
        "Regarding to Submitted Fees in Visual Media Technology",
        `Hello ${student.name} you have submitted fees `,
        `<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8" />
  <meta http-equiv="x-ua-compatible" content="ie=edge" />
  <title>Email Receipt</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style type="text/css">
    /**
           * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
           */
    @media screen {
      @font-face {
        font-family: "Source Sans Pro";
        font-style: normal;
        font-weight: 400;
        src: local("Source Sans Pro Regular"), local("SourceSansPro-Regular"),
          url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format("woff");
      }

      @font-face {
        font-family: "Source Sans Pro";
        font-style: normal;
        font-weight: 700;
        src: local("Source Sans Pro Bold"), local("SourceSansPro-Bold"),
          url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format("woff");
      }
    }

    /**
           * Avoid browser level font resizing.
           * 1. Windows Mobile
           * 2. iOS / OSX
           */
    body,
    table,
    td,
    a {
      -ms-text-size-adjust: 100%;
      /* 1 */
      -webkit-text-size-adjust: 100%;
      /* 2 */
    }

    /**
           * Remove extra space added to tables and cells in Outlook.
           */
    table,
    td {
      mso-table-rspace: 0pt;
      mso-table-lspace: 0pt;
    }

    /**
           * Better fluid images in Internet Explorer.
           */
    img {
      -ms-interpolation-mode: bicubic;
    }

    /**
           * Remove blue links for iOS devices.
           */
    a[x-apple-data-detectors] {
      font-family: inherit !important;
      font-size: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
      color: inherit !important;
      text-decoration: none !important;
    }

    /**
           * Fix centering issues in Android 4.4.
           */
    div[style*="margin: 16px 0;"] {
      margin: 0 !important;
    }

    body {
      width: 100% !important;
      height: 100% !important;
      padding: 0 !important;
      margin: 0 !important;
    }

    /**
           * Collapse table borders to avoid space between cells.
           */
    table {
      border-collapse: collapse !important;
    }

    a {
      color: #1a82e2;
    }

    img {
      height: auto;
      line-height: 100%;
      text-decoration: none;
      border: 0;
      outline: none;
    }
  </style>
</head>

<body style="background-color: #d2c7ba">
  <!-- start preheader -->
  <div class="preheader" style="
                display: none;
                max-width: 0;
                max-height: 0;
                overflow: hidden;
                font-size: 1px;
                line-height: 1px;
                color: #fff;
                opacity: 0;
              ">
    A preheader is the short summary text that follows the subject line when
    an email is viewed in the inbox.
  </div>
  <!-- end preheader -->

  <!-- start body -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <!-- start logo -->
    <tr>
      <td align="center" bgcolor="#D2C7BA">
        <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
          <tr>
            <td align="center" valign="top" style="padding: 36px 24px">
              <a href="https://sendgrid.com" target="_blank" style="display: inline-block">
                <img src="./img/paste-logo-light@2x.png" alt="Logo" border="0" width="48" style="
                              display: block;
                              width: 48px;
                              max-width: 48px;
                              min-width: 48px;
                            " />
              </a>
            </td>
          </tr>
        </table>
        <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
      </td>
    </tr>
    <!-- end logo -->

    <!-- start hero -->
    <tr>
      <td align="center" bgcolor="#D2C7BA">
        <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
          <tr>
            <td align="left" bgcolor="#ffffff" style="
                          padding: 36px 24px 0;
                          font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                          border-top: 3px solid #d4dadf;
                        ">
              <h1 style="
                            margin: 0;
                            font-size: 32px;
                            font-weight: 700;
                            letter-spacing: -1px;
                            line-height: 48px;
                          ">
                Thank you for your Fees Submit ${student.name}!
              </h1>
            </td>
          </tr>
        </table>
        <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
      </td>
    </tr>
    <!-- end hero -->
    <!-- start student info block -->
<tr>
<td align="center" bgcolor="#D2C7BA" valign="top" width="100%">
<table align="center" bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" width="100%"
  style="max-width: 600px">
  <tr>
    <td align="center" valign="top" style="font-size: 0;">

      <div style="
                        display: inline-block;
                        width: 100%;
                        max-width: 50%;
                        min-width: 240px;
                        vertical-align: top;
                      ">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 300px" cellspacing="0">
          <tr>
            <td valign="top" style="
                              padding-left: 36px;
                              font-family: 'Source Sans Pro', Helvetica, Arial,
                                sans-serif;
                              font-size: 16px;
                            ">
              <p><strong>Student Name</strong></p>
              <p><strong>Father Name</strong></p>
              <p><strong>Father Phone Number</strong></p>
              <p><strong>Roll Number</strong></p>
              <p><strong>Course Name</strong></p>
              <p><strong>Payment Method</strong></p>
              <p><strong>Academy Name</strong></p>

            </td>
          </tr>
        </table>
      </div>
      <div style="
                        display: inline-block;
                        width: 100%;
                        max-width: 50%;
                        min-width: 240px;
                        vertical-align: top;
                      ">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 300px" cellspacing="0">
          <tr>
            <td valign="top" style="
                              font-family: 'Source Sans Pro', Helvetica, Arial,
                                sans-serif;
                              font-size: 16px;
                              
                            ">
              <p>${student.name}</p>
              <p>
                ${student.father_name}
              </p>
              <p>
                +91 ${student.mobile_number}
                </p>
                <p>
                ${student.rollNumber}
              </p>
              <p>
              ${student.courseName.courseName} 
              </p>
              <p>
              ${findPaymentOptionName.name}
              </p>
              <p>
                ${student.companyName.companyName}
              </p>
            </td>
           
          </tr>
        </table>
      </div>
    </td>
  </tr>
</table>
</td>
</tr>
<!-- end student info block -->


    <!-- start copy block -->
    <tr>
      <td align="center" bgcolor="#D2C7BA">
        <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
          <!-- start copy -->
          <tr>
            <td align="left" bgcolor="#ffffff" style="
                          padding: 24px;
                          font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                          font-size: 16px;
                          line-height: 24px;
                        ">
              <p style="margin: 0">
                Here is a summary of your recent recipt. If you have any
                questions or concerns about your order, please
                <a href="https://sendgrid.com">contact us</a>.
              </p>
            </td>
          </tr>
          <!-- end copy -->

          <!-- start receipt table -->
          <tr>
            <td align="left" bgcolor="#ffffff" style="
                          padding: 24px;
                          font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                          font-size: 16px;
                          line-height: 24px;
                        ">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="left" bgcolor="#D2C7BA" width="75%" style="
                                padding: 12px;
                                font-family: 'Source Sans Pro', Helvetica, Arial,
                                  sans-serif;
                                font-size: 16px;
                                line-height: 24px;
                              ">
                    <strong>Recipt No</strong>
                  </td>
                  <td align="left" bgcolor="#D2C7BA" width="25%" style="
                                padding: 12px;
                                font-family: 'Source Sans Pro', Helvetica, Arial,
                                  sans-serif;
                                font-size: 16px;
                                line-height: 24px;
                              ">
                    <strong>${student.companyName.reciptNumber}</strong>
                  </td>
                </tr>
               

                <tr>
                  <td align="left" width="75%" style="
                                padding: 6px 12px;
                                font-family: 'Source Sans Pro', Helvetica, Arial,
                                  sans-serif;
                                font-size: 16px;
                                line-height: 24px;
                              ">
                    Course Fees
                  </td>
                  <td align="left" width="25%" style="
                                padding: 6px 12px;
                                font-family: 'Source Sans Pro', Helvetica, Arial,
                                  sans-serif;
                                font-size: 16px;
                                line-height: 24px;
                              ">
                    ${student.courseName.courseFees} Rs
                  </td>
                </tr>

                
                <tr>
                  <td align="left" width="75%" style="
                                padding: 6px 12px;
                                font-family: 'Source Sans Pro', Helvetica, Arial,
                                  sans-serif;
                                font-size: 16px;
                                line-height: 24px;
                              ">
                    Fees Paid
                  </td>
                  <td align="left" width="25%" style="
                                padding: 6px 12px;
                                font-family: 'Source Sans Pro', Helvetica, Arial,
                                  sans-serif;
                                font-size: 16px;
                                line-height: 24px;
                              ">
                    ${student.down_payment} Rs
                  </td>
                </tr>




                <tr>
                  <td align="left" width="75%" style="
                          padding: 6px 12px;
                          font-family: 'Source Sans Pro', Helvetica, Arial,
                            sans-serif;
                          font-size: 16px;
                          line-height: 24px;
                        ">
                    Late Fees
                  </td>
                  <td align="left" width="25%" style="
                          padding: 6px 12px;
                          font-family: 'Source Sans Pro', Helvetica, Arial,
                            sans-serif;
                          font-size: 16px;
                          line-height: 24px;
                        ">
                    ${lateFees} Rs
                  </td>
                </tr>
                <tr>
                  <td align="left" width="75%" style="
                          padding: 6px 12px;
                          font-family: 'Source Sans Pro', Helvetica, Arial,
                            sans-serif;
                          font-size: 16px;
                          line-height: 24px;
                        ">
                    GST (${student.companyName.gst} %)
                  </td>
                  <td align="left" width="25%" style="
                          padding: 6px 12px;
                          font-family: 'Source Sans Pro', Helvetica, Arial,
                            sans-serif;
                          font-size: 16px;
                          line-height: 24px;
                        ">
                        ${(
                          ((Number(lateFees) + Number(student.down_payment)) *
                            Number(student.companyName.gst)) /
                          100
                        ).toFixed(2)} Rs.
                  </td>
                </tr>
               
                <tr style='border:2px dotted black;'>
                  <td align="left" width="75%" style="
                          padding: 6px 12px;
                          font-family: 'Source Sans Pro', Helvetica, Arial,
                            sans-serif;
                          font-size: 16px;
                          line-height: 24px;
                        ">
                    Total Amount
                  </td>
                  <td align="left" width="25%" style="
                          padding: 6px 12px;
                          font-family: 'Source Sans Pro', Helvetica, Arial,
                            sans-serif;
                          font-size: 16px;
                          line-height: 24px;
                        ">
                    ${(
                      Number(lateFees) +
                      Number(student.down_payment) +
                      ((Number(lateFees) + Number(student.down_payment)) *
                        Number(student.companyName.gst)) /
                        100
                    ).toFixed(2)} Rs
                  </td>
                </tr>

                <!-- end reeipt table -->
              </table>
              <!--[if (gte mso 9)|(IE)]>
                    </td>
                    </tr>

                  

                </table>
                <![endif]-->
            </td>
          </tr>
          <!-- end copy block -->

          <!-- start 1 copy block -->
          <!-- end copy block -->

          <!-- start receipt address block -->
          <tr>
            <td align="center" bgcolor="#D2C7BA" valign="top" width="100%">
              <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
              <table align="center" bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" width="100%"
                style="max-width: 600px">
                <tr>
                  <td align="center" valign="top" style="font-size: 0; border-bottom: 3px solid #d4dadf">
                    <!--[if (gte mso 9)|(IE)]>
                      <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                      <tr>
                      <td align="left" valign="top" width="300">
                      <![endif]-->
                   
                    <!--[if (gte mso 9)|(IE)]>
                      </td>
                      <td align="center" valign="top" width="100%">
                      <![endif]-->
                    <div style="
                            display: inline-block;
                            width: 100%;
                            max-width: 50%;
                            min-width: 240px;
                            vertical-align: top;
                          ">
                      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
                        style="max-width: 300px">
                        <tr>
                          <td align="center" valign="top" style="
                                  padding-bottom: 36px;
                                  padding-left: 36px;
                                  font-family: 'Source Sans Pro', Helvetica, Arial,
                                    sans-serif;
                                  font-size: 16px;
                                  line-height: 24px;
                                ">
                           
                            
                              ${student.companyName.companyAddress}
                            
                          </td>
                        </tr>
                      </table>
                    </div>
                    <!--[if (gte mso 9)|(IE)]>
                      </td>
                      </tr>
                      </table>
                      <![endif]-->
                  </td>
                </tr>
              </table>
              <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
            </td>
          </tr>
          <!-- end receipt address block -->

          <!-- start footer -->
          <tr>
            <td align="center" bgcolor="#D2C7BA" style="padding: 24px">
              <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
                <!-- start permission -->
                <tr>
                  <td align="center" bgcolor="#D2C7BA" style="
                          padding: 12px 24px;
                          font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                          font-size: 14px;
                          line-height: 20px;
                          color: #666;
                        ">
                        <p>
                        CHEQUES SUBJECT TO REALISATION THE RECEIPT MUST BE PRODUCED WHEN
                        DEMANDED
                      </p>
                      <p>FEES ONCE PAID ARE NOT REFUNDABLE</p>
                      <p>Auth. Franchisee of Big Animation (1) Pvt. Ltd</p>
                    
                  </td>
                </tr>
                <!-- end permission -->

                <!-- start unsubscribe -->
                <tr>
                  <td align="center" bgcolor="#D2C7BA" style="
                          padding: 12px 24px;
                          font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                          font-size: 14px;
                          line-height: 20px;
                          color: #666;
                        ">
                    <p style="margin: 0">
                      To stop receiving these emails, you can
                      <a href="https://sendgrid.com" target="_blank">unsubscribe</a>
                      at any time.
                    </p>
                   
                    <p>www.relianceedu.com E-mail: chandigarh@relianceedu.com</p>
                  </td>
                </tr>
                <!-- end unsubscribe -->
              </table>
              <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
            </td>
          </tr>
          <!-- end footer -->
        </table>
        <!-- end body -->
</body>

</html>`
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
