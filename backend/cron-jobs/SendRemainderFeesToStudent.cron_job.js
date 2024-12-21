import cron from "node-cron";
import admissionFormModel from "../src/models/addmission_form.models.js";
import { userModel } from "../src/models/user.models.js";
import EmailRemainderModel from "../src/models/email-remainder/email.remainder.models.js";
import { sendEmail } from "../helpers/sendRemainderFees/SendRemainderFeesStudent.js";
import EmailLogModel from "../src/models/mail.models.js";
import moment from "moment";
import emailRemainderDatesModel from "../src/models/email-remainder/email.remainderDates.js";

const calculateReminderDates = async (installmentDurationDate) => {
  try {
    const dueDays = await emailRemainderDatesModel.findOne({});
    // console.log("Due Days Configuration:", dueDays);

    if (!dueDays) {
      throw new Error("No dueDays configuration found in the database.");
    }

    const { firstDueDay, secondDueDay, thirdDueDay } = dueDays;

    if (
      [firstDueDay, secondDueDay, thirdDueDay].some(
        (day) => day === undefined || isNaN(Number(day))
      )
    ) {
      throw new Error("Invalid dueDays configuration.");
    }

    const beforeDates = [
      moment(installmentDurationDate).subtract(6, "days").toDate(),
      moment(installmentDurationDate).subtract(3, "days").toDate(),
      moment(installmentDurationDate).subtract(1, "days").toDate(),
    ];

    const afterDates = [
      moment(installmentDurationDate).add(Number(firstDueDay), "days").toDate(),
      moment(installmentDurationDate)
        .add(Number(secondDueDay), "days")
        .toDate(),
      moment(installmentDurationDate).add(Number(thirdDueDay), "days").toDate(),
    ];

    // console.log("Calculated Reminder Dates:", { beforeDates, afterDates });

    return { beforeDates, afterDates };
  } catch (error) {
    console.error("Error in calculateReminderDates:", error.message);
    return { beforeDates: [], afterDates: [] }; // Fallback to empty arrays
  }
};

const sendReminderEmails = async (
  toEmails,
  student,
  template,
  lateFees,
  dueDateDifference,
  req,
  sendedBy
) => {
  // Dynamically replace placeholders in the template
  const personalizedContent = template
    .replace(
      "${installment_date}",
      moment(student.installment_duration).format("DD")
    )
    .replace(
      "${DueDates}",
      moment(student.installment_duration).format("DD-MM-YYYY")
    )
    .replace(/\n/g, "<br>")
    .replace("${LateFees}", lateFees ? `₹${lateFees}` : "No late fees")
    .replace(
      "${InstallmentAmount}",
      (student.no_of_installments_amount + lateFees).toFixed(2)
    );

  const subject = "Installment Payment Reminder";
  const text = "This is a formal notice regarding your fees installment.";
  const currentDateTime = moment().format("YYYY-MM-DD HH:mm:ss");

  // console.log("Final Email Content:", personalizedContent);

  // Send the email
  await sendEmail(toEmails, subject, text, personalizedContent, req, sendedBy);

  // Save the email log
  const emailLog = new EmailLogModel({
    recipientEmails: toEmails,
    subject,
    content: personalizedContent,
    sentAt: currentDateTime,
    sendedBy,
  });

  await emailLog.save();
};

const studentInfoToSendMailToStudent = async (req, res, next) => {
  try {
    const students = await admissionFormModel
      .find({})
      .populate(["courseName", "companyName"]);

    const currentDate = new Date(); // Current date

    // Fetch admin user emails
    const adminUsers = await userModel.find({});
    let toEmails = "";
    let sendedBy = "";
    adminUsers.forEach((user) => {
      if (user.role === "SuperAdmin") {
        toEmails = user.email;
        sendedBy = `${user.fName} ${user.lName}`;
      }
    });

    const emailRemainderData = await EmailRemainderModel.findOne({});
    const firstRemainderTemplate = emailRemainderData?.firstRemainder || "";
    const thirdRemainderTemplate = emailRemainderData?.thirdRemainder || "";

    for (const student of students) {
      if (
        student.remainingCourseFees &&
        student.remainingCourseFees !== 0 &&
        student.dropOutStudent === false
      ) {
        const installmentDurationDate = new Date(student.installment_duration);
        toEmails = `${toEmails},${student?.email}, ${student?.companyName.email},`;

        if (isNaN(installmentDurationDate)) {
          console.warn(
            `Invalid installment_duration for student: ${student.email}`
          );
          continue; // Skip processing if the date is invalid
        }

        const { beforeDates, afterDates } = await calculateReminderDates(
          installmentDurationDate
        );

        // Check if the current date matches any reminder dates
        let template = "";
        let lateFees = 0;

        if (
          beforeDates.some((date) => moment(date).isSame(currentDate, "day"))
        ) {
          // Send first reminder before due date
          template = firstRemainderTemplate;
        } else if (
          afterDates.some((date) => moment(date).isSame(currentDate, "day"))
        ) {
          // Send third reminder after due date
          const overdueDays = moment(currentDate).diff(
            moment(installmentDurationDate),
            "days"
          );

          // Apply late fee if overdueDays is greater than 0
          if (overdueDays > 0) {
            lateFees = overdueDays * 100; // Late fee calculation: Rs. 100 per day
          }

          console.log(overdueDays); // Logging the overdue days for debugging
          template = thirdRemainderTemplate;
        } else {
          continue; // Skip if the current date is not a scheduled reminder day
        }

        // Send the reminder email
        await sendReminderEmails(
          toEmails,
          student,
          template,
          lateFees,
          moment(installmentDurationDate).diff(currentDate, "days"),
          req,
          sendedBy
        );
      }
    }
  } catch (error) {
    console.error("Error fetching student or user data:", error);
  }
};

export default async function startSchedulerStudentRemainderFeesToStudents() {
  try {
    const cronSchedule = "16 17 * * *"; // Run daily at 9 AM
    cron.schedule(cronSchedule, studentInfoToSendMailToStudent);
    console.log("Scheduler for sending reminder fees to students has started.");
  } catch (error) {
    console.error("Error setting up scheduler:", error);
  }
}
