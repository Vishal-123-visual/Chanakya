import customFieldModel from "../../models/customForm/customForm.models.js";

export const addCustomFieldController = async (req, res, next) => {
  // console.log(req.body);
  try {
    const {
      type,
      name,
      value,
      mandatory,
      quickCreate,
      keyField,
      headerView,
      options,
      companyName,
      formId,
    } = req.body;
    const customField = new customFieldModel({
      type,
      name,
      value: type === "checkbox" ? value[0] : value,
      mandatory,
      quickCreate,
      keyField,
      headerView,
      options,
      companyName,
      formId,
    });
    await customField.save();
    res.status(200).json({ success: true, message: "added custom form" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllCustomFieldController = async (req, res, next) => {
  try {
    const allfields = await customFieldModel.find({});
    res.status(200).json(allfields);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteSingleFieldById = async (req, res, next) => {
  try {
    // console.log(req.params);
    const id = req.params.id;
    const field = await customFieldModel.findByIdAndDelete(id);
    if (!field) {
      return res
        .status(404)
        .json({ success: false, message: "field not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Field Has Been Deleted !!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
