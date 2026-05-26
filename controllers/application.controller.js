const Application = require("../models/application.model");
const mongoose = require("mongoose");


exports.applyForJob = async (req, res) => {
    try {
        const { jobId, applicantId, resumeLink } = req.body;

        const applicantObjectId = new mongoose.Types.ObjectId(applicantId);
        const jobObjectId = new mongoose.Types.ObjectId(jobId);

        const existingApp = await Application.findOne({ 
            job: jobObjectId, 
            applicant: applicantObjectId 
        });
        
        if (existingApp) {
            return res.status(400).json({ message: "You have already applied for this job!" });
        }

        const newApplication = new Application({
            job: jobObjectId,
            applicant: applicantObjectId,
            resumeLink
        });

        await newApplication.save();
        res.status(201).json({ message: "Application submitted successfully!" });

    } catch (error) {
        res.status(500).json({ message: "Error submitting application", error: error.message });
    }
};
exports.getJobApplicants = async (req, res) => {
    try {
        const { jobId } = req.params;

        // Find applications for this job and "populate" the applicant details
        const applications = await Application.find({ job: jobId })
            .populate("applicant", "firstName lastName email") 
            .select("-job"); // We already know the job, so we hide that field

        if (!applications || applications.length === 0) {
            return res.status(404).json({ message: "No applicants found for this job yet." });
        }

        res.status(200).json({
            count: applications.length,
            applicants: applications
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching applicants", error: error.message });
    }
};

exports.getUserApplications = async (req, res) => {
    try {
        const { userId } = req.params;
        const objectId = new mongoose.Types.ObjectId(userId);
        
        const applications = await Application.find({ applicant: objectId })
            .populate("job");
            
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: "Error fetching applications", error: error.message });
    }
};

exports.updateApplicationStatus = async (req, res) => {
    try {
        const { appId } = req.params;
        const { status } = req.body; // status will be "Accepted" or "Rejected"

        const updatedApp = await Application.findByIdAndUpdate(
            appId, 
            { status: status }, 
            { new: true }
        );

        res.status(200).json({ message: `Application ${status}`, application: updatedApp });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getJobApplications = async (req, res) => {
    try {
        const { jobId } = req.params;
        // Populate 'applicant' to see the user's name/email
        const applications = await Application.find({ job: jobId }).populate('applicant', 'name email');
        
        res.status(200).json({ applications });
    } catch (error) {
        res.status(500).json({ message: "Error fetching applications", error: error.message });
    }
};


// Get all applications for all jobs posted by an admin
exports.getAdminApplications = async (req, res) => {
    try {
        const { adminId } = req.params;
        const mongoose = require("mongoose");
        const objectId = new mongoose.Types.ObjectId(adminId);

        // Find all jobs by this admin
        const Job = require("../models/job.model");
        const myJobs = await Job.find({ postedBy: objectId }, '_id');
        const jobIds = myJobs.map(j => j._id);

        // Get all applications for those jobs
        const applications = await Application.find({ job: { $in: jobIds } })
            .populate("applicant", "firstName lastName email phone location bio skills photoUrl resumeUrl")
            .populate("job", "title company location jobType")
            .sort({ createdAt: -1 });

        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: "Error fetching applications", error: error.message });
    }
};