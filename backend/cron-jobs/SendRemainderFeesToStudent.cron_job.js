import cron from "node-cron";
import admissionFormModel from "../src/models/addmission_form.models.js";
import { userModel } from "../src/models/user.models.js";
import EmailRemainderModel from "../src/models/email-remainder/email.remainder.models.js";
import sendRemainderFeesStudent from "../helpers/sendRemainderFees/SendRemainderFeesStudent.js";

const studentInfoToSendMailToStudent = async () => {
  try {
    // Fetch all students with their courses and companies populated
    const students = await admissionFormModel
      .find({})
      .populate(["courseName", "companyName"]);

    let toEmails = "";
    const currentDate = new Date().getDate(); // Get the current day of the month

    // Fetch all admin users and add their emails to the list
    const adminUsers = await userModel.find({});
    adminUsers.forEach((user) => {
      if (user.role === "SuperAdmin") {
        toEmails = toEmails + user.email + ",";
      }
    });

    // Fetch the email remainder data
    const emailRemainderData = await EmailRemainderModel.findOne({});

    // Select the appropriate remainder message based on the current date
    let emailContent = "";
    if (currentDate === 15) {
      emailContent = emailRemainderData.firstRemainder; // First remainder content
    } else if (currentDate === 20) {
      emailContent = emailRemainderData.secondRemainder; // Second remainder content
    } else if (currentDate === 28) {
      emailContent = emailRemainderData.thirdRemainder; // Third remainder content
    } else {
      console.log("No remainder scheduled for today.");
      return; // Exit if today is not one of the scheduled days
    }

    // Append student emails who have remaining fees to the recipients list
    students.forEach((student) => {
      if (student.remainingCourseFees && student.remainingCourseFees !== 0) {
        toEmails = `${toEmails},${student?.email}, ${student?.companyName.email},`;
      }
    });

    console.log(toEmails);

    // Send the reminder email using the selected content
    if (toEmails) {
      console.log(`Sending reminder to: ${toEmails}`);
      // Uncomment and adjust the function to send the actual email
      await sendRemainderFeesStudent(
        toEmails,
        "Installment Payment Reminder",
        emailContent
      );
    }
  } catch (error) {
    console.error("Error fetching student or user data:", error);
  }
};

export default function startSchedulerStudentRemainderFeesToStudents() {
  // Schedule the task to run at 9:00 AM on the 15th, 20th, and 28th of each month
  // cron.schedule("0 9 15,20,28 * *", studentInfoToSendMailToStudent);
  cron.schedule("* * * * * *", studentInfoToSendMailToStudent);
  // console.log("Scheduler for sending remainder fees to students has started.");
}
