import Column from "../../models/customForm/columns.models.js";

export const saveReorderedColumns = async (req, res, next) => {
  const { companyId, formId, reorderedColumns, order } = req.body;
  // console.log("Request body:", req.body);

  try {
    if (!companyId || !formId || !reorderedColumns) {
      console.error("Missing required parameters");
      return res
        .status(400)
        .json({ success: false, message: "Missing required parameters" });
    }

    // Create an array of column objects with names and order
    const columns = reorderedColumns.map((name, index) => ({
      name,
      order: index + 1, // Order starts from 1
    }));

    // console.log("Formatted columns:", columns);

    // Find the existing column document for the specified company and form
    let columnData = await Column.findOne({ companyId, formId });

    if (!columnData) {
      console.log("Creating new Column document");
      // If no document exists, create a new one
      columnData = new Column({ companyId, formId, columns });
    } else {
      console.log("Updating existing Column document");
      // Update the existing document with the new column order
      columnData.columns = columns;
    }

    // Save the updated column data
    await columnData.save();

    res
      .status(200)
      .json({ success: true, message: "Columns reordered successfully!" });
  } catch (error) {
    console.error("Error saving columns:", error); // Log the full error
    res.status(500).json({ success: false, message: "Internal Server Error!" });
  }
};

export const getColumns = async (req, res, next) => {
  // console.log(req.body);
  try {
    const columnData = await Column.find({});

    if (!columnData) {
      return res
        .status(404)
        .json({ success: false, message: "Columns not found" });
    }

    res.status(200).json({ success: true, columnData });
  } catch (error) {
    console.error("Error fetching columns:", error); // Log the full error
    res.status(500).json({ success: false, message: "Internal Server Error!" });
  }
};

export const deleteColumnsController = async (req, res, next) => {
  // console.log(req.params);
  try {
    const { id } = req.params;
    const columnData = await Column.findByIdAndDelete(id);
    if (!columnData) {
      return res
        .status(404)
        .json({ success: false, message: "Column not found !!" });
    }
    res
      .status(200)
      .json({ success: true, message: "Column deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
