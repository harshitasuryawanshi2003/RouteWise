const express = require("express");
const router = express.Router();
const {
  createReport,
  getAllReports,
  updateReportStatus,
  getReportsByUserId
} = require("../controllers/ReportController");
const {auth, isAdmin, isCitizen} = require("../middlewares/auth");

// POST: Create a report
router.post("/", auth, isCitizen, createReport);

// GET: Get all reports
router.get("/", auth,isAdmin, getAllReports);

// get report from userId
router.get("/user/:userId",auth, isCitizen, getReportsByUserId);

// PUT: Update a report status (resolve it)
router.put("/:id",auth, isAdmin, updateReportStatus);

module.exports = router;
