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
    // console.log(subjectData);

    let adminEmails = "";
    const users = await userModel.find({});

    users?.map((user) => {
      // console.log(user.role, user.email);
      if (user.role === "SuperAdmin") {
        adminEmails += user.email + ",";
      }
    });
    // console.log("adminEmails", adminEmails);
    let sendedBy = `${req.user.fName} ${req.user.lName}`;
    // console.log(sendedBy);

    sendEmail(
      `${subjectData.email},${adminEmails}`,
      `Your Course Subjects `,
      `Hello ${subjectData.name} this is the fees Remainder to you `,
      `This is your Subject courses`,
      req,
      sendedBy
    );
    res.status(200).json({
      success: true,
      message: "Letter email sent to student successfully!",
    });
  } catch (error) {}
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
