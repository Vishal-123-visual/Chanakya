import asyncHandler from "../middlewares/asyncHandler.js";
import fs from "fs";
import CompanyModels from "../models/company/company.models.js";
import path from "path";

const __dirname = path.resolve();

export const createCompanyController = asyncHandler(async (req, res, next) => {
  const {
    companyName,
    companyPhone,
    companyWebsite,
    companyAddress,
    reciptNumber,
    gst,
    email,
  } = req.body;
  const file = req?.file?.filename;
  // console.log(file);
  try {
    switch (true) {
      case !file:
        return res.status(401).json({ message: "Company logo is required" });
      case !companyName:
        return res.status(401).json({ message: "Company name is required" });
      case !email:
        return res.status(401).json({ message: "Company email is required" });
      case !companyPhone:
        return res.status(401).json({ message: "Company phone is required" });
      case !companyWebsite:
        return res.status(401).json({ message: "Company website is required" });
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
      companyPhone,
      companyWebsite,
      companyAddress,
      reciptNumber,
      gst,
      email,
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
    const company = await CompanyModels.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    const file = req?.file?.filename;

    company.companyName = req.body.companyName || company.companyName;
    company.companyPhone = req.body.companyPhone || company.companyPhone;
    company.companyWebsite = req.body.companyWebsite || company.companyWebsite;
    company.companyAddress = req.body.companyAddress || company.companyAddress;
    company.reciptNumber = req.body.reciptNumber || company.reciptNumber;
    company.email = req.body.email || company.email;
    company.gst = req.body.gst || company.gst;
    // company.logo = file || company.logo;

    if (file) {
      let imagePath = company.logo;

      if (imagePath) {
        imagePath = path.join(__dirname + `/images/${imagePath}`);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        } else {
          console.log("File does not exist:", imagePath);
        }
      }
      company.logo = file;
    } else {
      company.logo = company.logo;
    }

    const updatedCompany = await company.save();
    res.status(200).json(updatedCompany);
  } catch (error) {
    res.status(500).json({ message: "Error in updating company" });
  }
});

export const deleteCompanyController = asyncHandler(async (req, res, next) => {
  try {
    const company = await CompanyModels.findById(req.params.id);
    //console.log(company);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    let imagePath = company.logo;

    if (imagePath) {
      imagePath = path.join(__dirname + `/images/${imagePath}`);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      } else {
        console.log("File does not exist:", imagePath);
      }
    }

    await company.deleteOne();
    res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error in delete company" });
  }
});
