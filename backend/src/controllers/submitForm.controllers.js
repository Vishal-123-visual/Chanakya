import mongoose from "mongoose";
import FormFieldValueModel from "../models/customForm/formField.models.js";

const transformRequestBody = (requestBody) => {
  const formId = requestBody.formId;

  const transformedData = Object.keys(requestBody)
    .filter((key) => key !== "formId" && key !== "0") // Exclude formId and any irrelevant keys
    .map((key) => {
      const field = requestBody[key];

      return {
        formId,
        name: key,
        type: field.type || "text", // Default to 'text' if no type is provided
        value: field.newValue === undefined ? field : field.newValue, // Use field.newValue if available, otherwise field itself
      };
    });

  return { formFieldValues: transformedData, formId };
};

export const submitFormController = async (req, res) => {
  try {
    // console.log(req.body.companyId);
    const formattedData = transformRequestBody(req.body);

    // console.log(formattedData);

    // Create a new document with the correct field names
    const newFormFieldValuesData = new FormFieldValueModel({
      formId: formattedData.formId,
      companyId: req.body.companyId,
      formFiledValue: formattedData.formFieldValues,
    });

    // Save the document to the database
    await newFormFieldValuesData.save();

    // Send a success response
    res
      .status(200)
      .json({ success: true, message: "Form data added successfully" });
  } catch (error) {
    // Handle any errors and send a failure response
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllSubmitFormData = async (req, res, next) => {
  // console.log(req.body);
  try {
    const formFieldValues = await FormFieldValueModel.find({});
    res.status(200).json({ success: true, formFieldValues });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error !!" });
  }
};

export const deleteSingleFormDataController = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the form data by its ID
    const formData = await FormFieldValueModel.findById(id);
    if (!formData) {
      return res
        .status(404)
        .json({ success: false, message: "Form data not found" });
    }

    // Delete the form data
    await formData.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "Form data deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error !!" });
  }
};

export const getSingleFormDataValueByIdController = async (req, res, next) => {
  console.log(req.body);
  // console.log(req.params);
  try {
    const { id } = req.params;
    const formFieldValues = await FormFieldValueModel.findById(id);
    if (!formFieldValues) {
      return res
        .status(404)
        .json({ success: false, message: "Form data not found" });
    }
    res.status(200).json(formFieldValues);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error !!" });
  }
};

export const updateSingleFormDataValueController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { formFieldValues } = req.body;

    // Validate the ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid ID format" });
    }

    // Find the existing form field values data
    const existingFormFieldValuesData = await FormFieldValueModel.findById(id);
    if (!existingFormFieldValuesData) {
      return res
        .status(404)
        .json({ success: false, message: "Form Field Data not found !!" });
    }

    // Ensure formFieldValues is an array
    if (!Array.isArray(formFieldValues)) {
      return res.status(400).json({
        success: false,
        message: "formFieldValues should be an array",
      });
    }

    // Update the fields
    existingFormFieldValuesData.formFiledValue =
      existingFormFieldValuesData.formFiledValue.map((field) => {
        const updatedField = formFieldValues.find((f) => f.name === field.name);
        if (updatedField) {
          // Update field with new values
          return { ...field, value: updatedField.value };
        }
        return field;
      });

    // Save the updated document
    await existingFormFieldValuesData.save();

    res.status(200).json({ success: true, data: existingFormFieldValuesData });
  } catch (error) {
    console.error("Error updating form data:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
