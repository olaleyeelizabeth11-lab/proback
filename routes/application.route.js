const express = require("express");
const router = express.Router();
const { applyForJob, getJobApplicants, getUserApplications, updateApplicationStatus, getAdminApplications } = require("../controllers/application.controller");

router.post("/apply", applyForJob);
router.get("/job/:jobId", getJobApplicants);
router.get("/user/:userId", getUserApplications);
router.put("/status/:appId", updateApplicationStatus);
router.get("/admin/:adminId", getAdminApplications);
module.exports = router;