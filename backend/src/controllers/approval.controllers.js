import approvalModel from "../models/approval/approval.models.js";

export const postApprovalController = async (req, res, next) => {
  try {
    // console.log(req.body);
    const { status, reciept, companyId, studentId } = req.body;
    // const approval = await approvalModel.findOne({ reciept });
    // if (approval) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "Reciept Already Exists !!" });
    // }
    const approvalStatus = new approvalModel({
      companyId,
      reciept,
      status,
      studentId,
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
    const approvalData = await approvalModel.find({});
    res.status(200).json({ success: true, approvalData });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error !!" });
  }
};
