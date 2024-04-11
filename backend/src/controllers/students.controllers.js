import asyncHandler from "../middlewares/asyncHandler.js";
import admissionFormModel from "../models/addmission_form.models.js";
import CourseFeesModel from "../models/courseFees/courseFees.models.js";

export const getAllStudentsController = asyncHandler(async (req, res, next) => {
  try {
    const users = await admissionFormModel.find({}).sort({ createdAt: -1 });
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export const updateStudentController = asyncHandler(async (req, res, next) => {
  try {
    const student = await admissionFormModel.findOne({ _id: req.params?.id });
    if (!student) {
      res.status(404).json({ success: false, message: "Student not found!" });
      return; // Added return to exit the function if student is not found
    }

    const file = req?.file?.filename;
    const {
      rollNumber,
      name,
      father_name,
      mobile_number,
      phone_number,
      present_address,
      permanent_address,
      date_of_birth,
      city,
      email,
      student_status,
      education_qualification,
      professional_qualification,
      select_course,
      // document_attached,
      // select_software,
      name_of_person_for_commision,
      commision_paid,
      commision_date,
      commision_voucher_number,
      course_fees,
      discount,
      netCourseFees,
      remainingCourseFees,
      down_payment,
      date_of_joining,
      no_of_installments,
    } = req.body;
    // console.log(req.body);

    // Use || for conditional updates
    student.rollNumber = rollNumber || student.rollNumber;
    student.name = name || student.name;
    student.father_name = father_name || student.father_name;
    student.mobile_number = mobile_number || student.mobile_number;
    student.phone_number = phone_number || student.phone_number;
    student.present_address = present_address || student.present_address;
    student.permanent_address = permanent_address || student.permanent_address;
    student.date_of_birth = date_of_birth || student.date_of_birth;
    student.city = city || student.city;
    student.email = email || student.email;
    student.student_status = student_status || student.student_status;
    student.education_qualification =
      education_qualification || student.education_qualification;
    student.professional_qualification =
      professional_qualification || student.professional_qualification;
    student.select_course = select_course || student.select_course;
    // student.document_attached = document_attached || student.document_attached;
    // student.select_software = select_software || student.select_software;
    student.name_of_person_for_commision =
      name_of_person_for_commision || student.name_of_person_for_commision;
    student.commision_paid = commision_paid || student.commision_paid;
    student.commision_date = commision_date || student.commision_date;
    student.commision_voucher_number =
      commision_voucher_number || student.commision_voucher_number;
    student.course_fees = course_fees || student.course_fees;
    student.discount = discount || student.discount;
    student.netCourseFees = netCourseFees || student.netCourseFees;
    student.remainingCourseFees =
      remainingCourseFees || student.remainingCourseFees;
    student.down_payment = down_payment || student.down_payment;
    student.date_of_joining = date_of_joining || student.date_of_joining;
    student.no_of_installments =
      no_of_installments || student.no_of_installments;
    student.image = file || student.image;

    let updatedStudent = await student.save();

    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export const deleteStudentController = asyncHandler(async (req, res, next) => {
  try {
    // Find the student
    const student = await admissionFormModel.findById(req.params.id);

    // Handle case where student is not found
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found!" });
    }

    // Find associated course fees records
    const studentCourseFeesRecord = await CourseFeesModel.find({
      studentInfo: req.params.id,
    });

    studentCourseFeesRecord?.map(
      async (studentFeeRecord) => await studentFeeRecord?.deleteOne()
    );
    // Delete the student
    await student.deleteOne();

    // Send success response
    res
      .status(200)
      .json({ success: true, message: "Student deleted successfully!" });
  } catch (error) {
    // Handle errors
    res.status(500).json({ success: false, message: error.message });
  }
});

export const getSingleStudentDetailsController = asyncHandler(
  async (req, res, next) => {
    try {
      const student = await admissionFormModel.findById(req.params.id);
      res.status(200).json(student);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);
