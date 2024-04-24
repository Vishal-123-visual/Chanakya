import asyncHandler from "../middlewares/asyncHandler.js";
import fs from "fs";
import CompanyModels from "../models/company/company.models.js";

export const createCompanyController = asyncHandler(async (req, res, next) => {
  const { companyName, companyAddress, reciptNumber, gst } = req.body;
  const file = req?.file?.filename;
  console.log(file);
  try {
    switch (true) {
      case !file:
        return res.status(401).json({ message: "Company logo is required" });
      case !companyName:
        return res.status(401).json({ message: "Company name is required" });
      case !companyAddress:
        return res
          .status(401)
          .json({ message: "Company Address name is required" });
      case !reciptNumber:
        return res.status(401).json({ message: "Recipt Number  is required" });
      case !gst:
        return res.status(401).json({ message: "GSt Number is required" });
      default:
        break;
    }
    const newCompany = new CompanyModels({
      companyName,
      companyAddress,
      reciptNumber,
      gst,
      logo: file,
    });
    const savedCompany = await newCompany.save();
    res.status(200).json(savedCompany);
  } catch (error) {
    res.status(500).json({ message: "Error in creating company!" });
  }
});

export const getAllCompanyListsController = asyncHandler(
  async (req, res, next) => {
    try {
      const companies = await CompanyModels.find({});
      res.status(200).json(companies);
    } catch (error) {
      res.status(500).json({ message: "Error in getting company lists" });
    }
  }
);
export const updateCompanyController = asyncHandler(async (req, res, next) => {
  try {
    const companies = await CompanyModels.find({});
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: "Error in updating company" });
  }
});
export const deleteCompanyController = asyncHandler(async (req, res, next) => {
  try {
    const company = await CompanyModels.findById(req.params.id);
    console.log(company);

    let imagePath = company.logo;
    if (imagePath) {
      imagePath = `C:/Users/Web/Desktop/SchoolsManagement-2-main/backend/images/${imagePath}`;
      fs.unlinkSync(imagePath);
    }

    await company.deleteOne();
    res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error in delete company" });
  }
});
