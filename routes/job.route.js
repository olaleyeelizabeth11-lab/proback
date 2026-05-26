const express = require("express");
const router = express.Router();
const { createJob, getAllJobs, updateJob, deleteJob, getAdminJobs } = require("../controllers/job.controller");

router.post("/create", createJob);
router.get("/all", getAllJobs);
router.get("/admin/:adminId", getAdminJobs);   
router.put("/update/:jobId", updateJob);    
router.delete("/delete/:jobId", deleteJob);

module.exports = router;