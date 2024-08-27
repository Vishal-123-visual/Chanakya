import Row from "../../models/customForm/rows.models.js";

export const saveReorderedRows = async (req, res, next) => {
  const { companyId, formId, reorderedRows } = req.body;
  // console.log("Request Body:", req.body);

  try {
    if (!companyId || !formId || !reorderedRows) {
      console.error("Missing required parameters");
      return res
        .status(400)
        .json({ success: false, message: "Missing required parameters" });
    }

    let rowData = await Row.findOne({ companyId, formId });

    // console.log("Existing Row Data:", rowData);

    if (rowData) {
      // Update existing rows
      reorderedRows.forEach((newRow) => {
        const existingRowIndex = rowData.rows.findIndex(
          (row) => row.id === newRow.id
        );
        if (existingRowIndex !== -1) {
          // Update existing row
          rowData.rows[existingRowIndex] = newRow;
        } else {
          // Add new row if it does not exist
          rowData.rows.push(newRow);
        }
      });

      // Remove rows that are not in reorderedRows
      rowData.rows = rowData.rows.filter((row) =>
        reorderedRows.some((newRow) => newRow.id === row.id)
      );

      // Save updated document
      await rowData.save();
      // console.log("Updated Row Data:", rowData);
    } else {
      rowData = new Row({ companyId, formId, rows: reorderedRows });

      await rowData.save();
      // console.log("New Row Data:", rowData);
    }

    res.status(200).json({ success: true, data: rowData });
  } catch (error) {
    console.error("Error saving rows:", error);
    res.status(500).json({ success: false, message: "Internal Server Error!" });
  }
};

export const getRows = async (req, res, next) => {
  try {
    const rowData = await Row.find({});

    if (!rowData) {
      return res
        .status(404)
        .json({ success: false, message: "Rows not found" });
    }

    res.status(200).json({ success: true, rowData });
  } catch (error) {
    console.error("Error fetching rows:", error); // Log the full error
    res.status(500).json({ success: false, message: "Internal Server Error!" });
  }
};

export const deleteRow = async (req, res, next) => {
  try {
    const id = req.params.id;
    // console.log(id);
    const rowData = await Row.findByIdAndDelete(id);
    // console.log(rowData);
    if (!rowData) {
      return res
        .status(404)
        .json({ success: false, message: "Row Data not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "RowData Has Been Deleted !!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
