import { Router } from "express";
import {
  addSubjectController,
  getCourseSubjectsListsController,
  updateCourseSubjectController,
  deleteCourseSubjectController,
  getSubjectBasedOnCourseController,
} from "../controllers/subject.controllers.js";
import { isAdmin, requireSignIn } from "../middlewares/auth.middleware.js";
import {
  addCourseSubjectMarksController,
  getCourseSubjectMarksController,
  updateCourseSubjectMarksController,
} from "../controllers/StudentSubjectMarks.controllers.js";
import { userModel } from "../models/user.models.js";
import { sendEmail } from "../../helpers/sendRemainderFees/SendRemainderFeesStudent.js";
const router = Router();

router
  .route("/")
  .post(requireSignIn, isAdmin, addSubjectController)
  .get(requireSignIn, getCourseSubjectsListsController);
router
  .route("/:id")
  .put(requireSignIn, isAdmin, updateCourseSubjectController)
  .delete(requireSignIn, isAdmin, deleteCourseSubjectController);

router.post("/marks", addCourseSubjectMarksController);
router.get("/marks/:studentId", getCourseSubjectMarksController);
router.put("/marks/:studentId/:marksId", updateCourseSubjectMarksController);

router.post("/subject-mail", requireSignIn, async (req, res, next) => {
  try {
    const subjectData = req.body;
    // console.log("Subject Data:", subjectData);

    let adminEmails = "";
    const users = await userModel.find({});

    users?.map((user) => {
      if (user.role === "SuperAdmin") {
        adminEmails += user.email + ",";
      }
    });

    let sendedBy = `${req.user.fName} ${req.user.lName}`;

    // Extract student information from studentData
    const studentInfo = subjectData.studentData;
    const studentId = studentInfo._id;
    const courseId = studentInfo.courseName; // Assuming courseName is the courseId
    const desiredSemYear = ["Year 1", "Year 2"]; // You can dynamically set this based on your requirements

    // Extract the array of subject entries
    const subjectsArray = subjectData.subjectData;

    // Filter subjects for the current student, course, and desired semester year
    const studentSubjects = subjectsArray
      .filter(
        (data) =>
          data.studentInfo._id === studentId && data.course._id === courseId
      ) // Filter by student ID and course ID
      .flatMap((data) => {
        // Filter subjects where the value is true and semYear matches
        return Object.entries(data.subjects)
          .filter(
            ([key, value]) =>
              value === true &&
              desiredSemYear.includes(data.Subjects.semYear) &&
              data.Subjects.course === courseId
          )
          .map(([key]) => ({
            subjectName: data.Subjects.subjectName,
            semYear: data.Subjects.semYear,
          })); // Map to subject names and semester years
      });

    // console.log("Filtered Subjects:", studentSubjects);

    // Group subjects by semester year and remove duplicates
    const groupedSubjects = studentSubjects.reduce((acc, subject) => {
      if (!acc[subject.semYear]) {
        acc[subject.semYear] = new Set();
      }
      acc[subject.semYear].add(subject.subjectName);
      return acc;
    }, {});

    // console.log("Grouped Subjects:", groupedSubjects);

    // Create a string with subjects grouped by semester year
    let subjectsString = "";
    for (const [semYear, subjects] of Object.entries(groupedSubjects)) {
      subjectsString += `Subjects for ${semYear}: ${Array.from(subjects).join(
        ", "
      )}\n`;
    }

    // console.log("Subjects String:", subjectsString);

    // Extract the current student's email
    const studentEmail = studentInfo.email;

    sendEmail(
      `${studentEmail},${adminEmails}`, // Use the student's email
      `Your Course Subjects `,
      `Hello ${studentInfo.name}, this is your course subjects.`,
      `This is your Subject courses:\n${subjectsString}`,
      req,
      sendedBy
    );

    res.status(200).json({
      success: true,
      message: "Email sent to student successfully!",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send email.",
    });
  }
});
// router.post(
//   "/add-on-subject",
//   requireSignIn,
//   studentAddOnCourseSubjectController
// );

// router.get("/all-add-on-subjects", getAllAddOnSubjectController);
// get subject according to course
router.get("/:courseId", getSubjectBasedOnCourseController);

export default router;
