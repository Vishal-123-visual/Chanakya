import asyncHandler from "../middlewares/asyncHandler.js";
import studentSubjectMarksModel from "../models/subject/student.subject.marks.models.js";

export const addCourseSubjectMarksController = asyncHandler(
  async (req, res, next) => {
    console.log("Received request to add marks:", req.body);

    try {
      // Check if a record already exists for the student, subject, and course combination
      const existingRecord = await studentSubjectMarksModel.findOne({
        studentInfo: req.body.studentId,
        Subjects: req.body.subjectId,
        course: req.body.courseId,
      });

      if (existingRecord) {
        console.log("Record already exists:", existingRecord);
        return res
          .status(400)
          .json({
            success: false,
            message: "Marks for this subject already added",
          });
      }

      const saveStudentSubjectMarks = new studentSubjectMarksModel({
        ...req.body,
        studentInfo: req.body.studentId,
        Subjects: req.body.subjectId,
        course: req.body.courseId,
      });

      await saveStudentSubjectMarks.save();
      res.status(200).json({ success: true, message: "Marks added" });
    } catch (error) {
      console.log("Error while adding marks:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

export const getCourseSubjectMarksController = asyncHandler(
  async (req, res, next) => {
    try {
      const studentSubjectMarks = await studentSubjectMarksModel
        .find({ studentInfo: req.params.studentId })
        .populate(["studentInfo", "Subjects", "course"]);
      res.status(200).json(studentSubjectMarks);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);
