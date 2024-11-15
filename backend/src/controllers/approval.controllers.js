import approvalModel from "../models/approval/approval.models.js";

export const postApprovalController = async (req, res, next) => {
  try {
    // console.log(req.body);
    const { status, reciept, companyId, studentId, check } = req.body;
    const approval = await approvalModel.findOne({ reciept });
    if (approval) {
      await approval.deleteOne();
    }
    const approvalStatus = new approvalModel({
      companyId,
      reciept,
      status,
      studentId,
      check,
    });
    await approvalStatus.save();
    res.status(201).json({ success: true, approvalStatus });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal Sever Error !!" });
  }
};

export const getAllApprovalStatusController = async (req, res, next) => {
  try {
    const approvalData = await approvalModel
      .find({})
      .populate(["studentId", "reciept"]);
    res.status(200).json({ success: true, approvalData });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error !!" });
  }
};

// export const deleteSingleApprovalDataController = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     console.log(object)
//     const approvalData = await approvalModel.findByIdAndDelete(id);
//     res.status(200).json({ success: true, approvalData });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ success: false, message: "Internal Sever Error !!" });
//   }
// };
