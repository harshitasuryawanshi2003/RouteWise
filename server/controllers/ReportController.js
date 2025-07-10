const Bin = require("../models/Bin");
const Report = require("../models/Report");
const User = require("../models/User");

// Create a new report
exports.createReport = async (req, res) => {
  try {
    const { binId, reportedBy, message } = req.body;

    const report = new Report({
      binId,
      reportedBy,
      message,
    });

    await report.save();
    res.status(201).json({ 
        success: true, 
        report 
    });

  } catch (error) {
    res.status(500).json({ 
        success: false, 
        message: "Failed to create report", 
        error 
    });
  }
};

// Get all reports
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("binId", "location type")
      .populate("reportedBy", "name email role");
    res.status(200).json({ 
        success: true, 
        reports 
    });
  } catch (error) {
    res.status(500).json({ 
        success: false, 
        message: "Failed to fetch reports", 
        error 
    });
  }
};

// Update report status (e.g., mark as resolved)
exports.updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const report = await Report.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ 
        success: false, 
        message: "Report not found" 
      });
    }

    res.status(200).json({ 
        success: true, 
        report 
    });
  } catch (error) {
    res.status(500).json({ 
        success: false, 
        message: "Failed to update report", 
        error 
    });
  }
};

// Get reports by user ID
exports.getReportsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const reports = await Report.find({ reportedBy: userId })
              .populate("binId", "location type");

     if (!reports) {
      return res.status(404).send('Report not found');
    }

    console.log("reports found:", reports.length);

    res.status(200).json({
      success: true,
      reports,
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch reports by user ID",
      error,
    });
  }
};
