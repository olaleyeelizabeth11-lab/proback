const Job = require("../models/job.model");
const Application = require("../models/application.model");

exports.createJob = async (req, res) => {
    try {
        // 1. You must include 'postedBy' in this list so JS knows what it is
        const { title, company, location, salary, description, requirements, jobType, postedBy } = req.body;

        // 2. Now 'postedBy' exists as a variable and can be used here
        const newJob = new Job({
            title,
            company,
            location,
            salary,
            description,
            requirements,
            jobType,
            postedBy // This matches the name in your Model and the variable above
        });

        await newJob.save();
        res.status(201).json({ message: "Job posted successfully!", job: newJob });

    } catch (error) {
        // This is the line catching the "not defined" error currently
        res.status(500).json({ message: "Error posting job", error: error.message });
    }
};

// Route to get ALL jobs (for the User to see)
exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate("postedBy", "firstName lastName email");
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching jobs", error: error.message });
    }
};

// Edit a job
exports.updateJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const { title, company, location, salary, description, requirements, jobType } = req.body;

        const updatedJob = await Job.findByIdAndUpdate(
            jobId,
            { title, company, location, salary, description, requirements, jobType },
            { new: true, runValidators: true }
        );

        if (!updatedJob) return res.status(404).json({ message: "Job not found" });

        res.status(200).json({ message: "Job updated successfully!", job: updatedJob });
    } catch (error) {
        res.status(500).json({ message: "Error updating job", error: error.message });
    }
};

// Delete a job
exports.deleteJob = async (req, res) => {
    try {
        const { jobId } = req.params;

        const job = await Job.findByIdAndDelete(jobId);
        if (!job) return res.status(404).json({ message: "Job not found" });

        // Also delete all applications for this job
        await Application.deleteMany({ job: jobId });

        res.status(200).json({ message: "Job and related applications deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting job", error: error.message });
    }
};

// Get jobs by admin
exports.getAdminJobs = async (req, res) => {
    try {
        const { adminId } = req.params;
        const mongoose = require("mongoose");
        const objectId = new mongoose.Types.ObjectId(adminId);

        const jobs = await Job.find({ postedBy: objectId })
            .sort({ createdAt: -1 });

        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching jobs", error: error.message });
    }
};