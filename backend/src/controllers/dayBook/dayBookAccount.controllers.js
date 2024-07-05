import asyncHandler from "../../middlewares/asyncHandler.js";
import CourseFeesModel from "../../models/courseFees/courseFees.models.js";
import DayBookAccountModel from "../../models/day-book/DayBookAccounts.models.js";
import DayBookDataModel from "../../models/day-book/DayBookData.models.js";

export const addDayBookAccountController = asyncHandler(
  async (req, res, next) => {
    const { accountName, accountType } = req.body;
    try {
      switch (true) {
        case !accountName:
          return res.status(400).json({ error: "Account name is required" });
        case !accountType:
          return res.status(400).json({ error: "Account name is required" });
      }

      const existingAccountName = await DayBookAccountModel.find({
        accountName,
      });

      if (!existingAccountName) {
        return res
          .status(400)
          .json({ error: "DayBook Account already exists" });
      }

      const newDayBookAccount = new DayBookAccountModel({
        accountName,
        accountType,
      });
      await newDayBookAccount.save();
      res.status(201).json(newDayBookAccount);
    } catch (error) {
      res.status(500).json({
        error: "Error while creating account in daybook" || error.message,
      });
    }
  }
);

export const getDayBookAccountsListsController = asyncHandler(
  async (req, res, next) => {
    try {
      const daybookAccounts = await DayBookAccountModel.find({});
      res.status(200).json(daybookAccounts);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error while getting day book accounts lists" });
    }
  }
);

export const deleteDayBookAccountsListDataController = asyncHandler(
  async (req, res, next) => {
    try {
      const daybookAccount = await DayBookAccountModel.findById(req.params.id);
      if (!daybookAccount) {
        return res.status(404).json({ error: "Not found day book account" });
      }
      await daybookAccount.deleteOne();
      res.status(200).json({ message: "Day book account deleted" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error while getting day book accounts lists" });
    }
  }
);

export const updateDayBookAccountController = asyncHandler(
  async (req, res, next) => {
    const { accountName, accountType } = req.body;
    try {
      const dayBookAccount = await DayBookAccountModel.findById(req.params.id);
      dayBookAccount.accountName = accountName || dayBookAccount.accountName;
      dayBookAccount.accountType = accountType || dayBookAccount.accountType;
      await dayBookAccount.save();
      res
        .status(200)
        .json({ message: "Day Book Account updated successfully" });
    } catch (error) {
      res.status(500).json({
        error: "Error while updating the day book account" || error.message,
      });
    }
  }
);

//  Day Book Data Controller start here -------------------------------------------------

export const addDayBookDataController = asyncHandler(async (req, res, next) => {
  const {
    accountName,
    dayBookAccountId,
    dayBookDatadate,
    debit,
    credit,
    naretion,
  } = req.body;

  console.log(req.body);
  try {
    const existingDataModel = await DayBookDataModel.find({}).sort({
      createdAt: -1,
    });
    const newDayBookData = new DayBookDataModel({
      ...req.body,
      balance:
        Number(credit) > 0
          ? existingDataModel[0].balance + Number(credit)
          : existingDataModel[0].balance - Number(debit),
    });
    await newDayBookData.save();
    res.status(201).json(newDayBookData);
  } catch (error) {
    res.status(500).json({
      error: "Error: while creating the day book data " || error.message,
    });
  }
});

export const getDayBookDataController = asyncHandler(async (req, res, next) => {
  try {
    const dayBookData = await DayBookDataModel.find({})
      .sort({ createdAt: -1 })
      .populate("studentInfo");
    res.status(200).json(dayBookData);
  } catch (error) {
    res.status(500).json({
      error: "Error: while getting the day book data " || error.message,
    });
  }
});
export const getSingleDayBookDataController = asyncHandler(
  async (req, res, next) => {
    try {
      const dayBookData = await DayBookDataModel.find({
        dayBookAccountId: req.params.id,
      }).sort({
        createdAt: 1,
      });
      res.status(200).json(dayBookData);
    } catch (error) {
      res.status(500).json({
        error: "Error: while getting the day book data " || error.message,
      });
    }
  }
);

//  Day Book Data Controller End here -------------------------------------------------
