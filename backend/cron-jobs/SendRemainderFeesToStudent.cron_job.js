import cron from "node-cron";
import admissionFormModel from "../src/models/addmission_form.models.js";
import { userModel } from "../src/models/user.models.js";
import EmailRemainderModel from "../src/models/email-remainder/email.remainder.models.js";
import { sendEmail } from "../helpers/sendRemainderFees/SendRemainderFeesStudent.js";
import emailRemainderDatesModel from "../src/models/email-remainder/email.remainderDates.js";
import EmailLogModel from "../src/models/mail.models.js";

const studentInfoToSendMailToStudent = async (req,res,next) => {
  try {
    // Fetch all students with their courses and companies populated
    const students = await admissionFormModel
      .find({})
      .populate(["courseName", "companyName"]);

    let firstRemainderDay = "";
    let secondRemainderDay = "";
    let thirdRemainderDay = "";
    let toEmails = "";
    const currentDate = new Date().getDate(); // Get the current day of the month

    // Fetch all admin users and add their emails to the list
    const adminUsers = await userModel.find({});
    adminUsers.forEach((user) => {
      if (user.role === "SuperAdmin") {
        toEmails = user.email;
      }
    });

    const emailRemainderDates = await emailRemainderDatesModel.findOne({});
    if (emailRemainderDates) {
      ({ firstRemainderDay, secondRemainderDay, thirdRemainderDay } =
        emailRemainderDates);
    }

    // Fetch the email remainder data
    const emailRemainderData = await EmailRemainderModel.findOne({});

    // Select the appropriate remainder message based on the current date
    let emailContent = "";
    if (currentDate === firstRemainderDay) {
      emailContent = emailRemainderData.firstRemainder; // First remainder content
    } else if (currentDate === secondRemainderDay) {
      emailContent = emailRemainderData.secondRemainder; // Second remainder content
    } else if (currentDate === thirdRemainderDay) {
      emailContent = emailRemainderData.thirdRemainder; // Third remainder content
    } else {
      return; // Exit if today is not one of the scheduled days
    }

    // Append student emails who have remaining fees to the recipients list
    students.forEach((student) => {
      if (
        student.remainingCourseFees &&
        student.remainingCourseFees !== 0 &&
        student.dropOutStudent === false
      ) {
        toEmails = `${toEmails},${student?.email}, ${student?.companyName.email},`;
      }
    });

    // Send the reminder email using the selected content
    if (toEmails) {
      // Construct the email subject and content
      const subject = "Installment Payment Reminder";
      const currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
      // const addedBy = req.user.fName +  " " + req.user.lName
      
      // Send the email
      await sendEmail(toEmails, subject, emailContent,req);

      // Log the sent email to the database (EmailLogModel)
      const emailLog = new EmailLogModel({
        recipientEmails: toEmails,    // List of recipients
        subject: subject,             // Email subject
        content: emailContent,        // Email content
        sentAt: currentDateTime,       // Timestamp of when the email was sent
        sendedBy:  req.user.fName +  " " + req.user.lName,
      });

      // Save the email log
      await emailLog.save();
    }
  } catch (error) {
    console.error("Error fetching student or user data:", error);
  }
};


export default async function startSchedulerStudentRemainderFeesToStudents() {
  try {
    // Fetch the reminder dates from the database
    const emailRemainderDates = await emailRemainderDatesModel.findOne({});

    if (emailRemainderDates) {
      const { firstRemainderDay, secondRemainderDay, thirdRemainderDay } =
        emailRemainderDates;

      // Construct the cron schedule string dynamically
      const cronSchedule = `0 9 ${firstRemainderDay},${secondRemainderDay},${thirdRemainderDay} * *`;

      // Schedule the task with the dynamic cron expression
      cron.schedule(cronSchedule, studentInfoToSendMailToStudent);

      console.log(
        `Scheduler for sending remainder fees to students has started with the following days: ${firstRemainderDay}, ${secondRemainderDay}, ${thirdRemainderDay}`
      );
    } else {
      console.log("No remainder dates found in the database.");
    }
  } catch (error) {
    console.error("Error setting up scheduler:", error);
  }
}
