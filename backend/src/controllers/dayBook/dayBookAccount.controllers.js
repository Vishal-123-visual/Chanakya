import asyncHandler from "../../middlewares/asyncHandler.js";
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
  try {
    switch (true) {
      case !accountName:
        return res.status(400).json({ error: "Account name is required" });
      case !dayBookAccountId:
        return res
          .status(400)
          .json({ error: "Day Book Account Id is required" });
      case !dayBookDatadate:
        return res.status(400).json({ error: "Date is required" });
      case !debit:
        return res
          .status(404)
          .json({ error: "Day Book Data debit is required" });
      case !credit:
        return res
          .status(404)
          .json({ error: "Day Book Data credit is required" });
      case !naretion:
        return res
          .status(404)
          .json({ error: "Day Book Data naretion is required" });
      default:
        break;
    }

    const newDayBookData = new DayBookDataModel(req.body);
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
    const dayBookData = await DayBookDataModel.find({});
    res.status(200).json(dayBookData);
  } catch (error) {
    res.status(500).json({
      error: "Error: while getting the day book data " || error.message,
    });
  }
});

//  Day Book Data Controller End here -------------------------------------------------
