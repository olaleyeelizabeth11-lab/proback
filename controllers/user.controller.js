const mongoose = require("mongoose");
const User = require("../models/user.model");
const ejs = require('ejs')
const bcrypt = require('bcrypt')
const Job = require("../models/job.model");
const Application = require("../models/application.model");

exports.registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role 
        });
        await user.save();
        res.status(201).json({ message: "User registered successfully!" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found! Please register first." });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials (wrong password)!" });
        }
        res.status(200).json({
            message: `Welcome back, ${user.firstName}!`,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role 
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


exports.getUserDashboard = async (req, res) => {
    try {
        const { id } = req.params;

        // Cast string id to ObjectId — this is what fixes the count
        const objectId = new mongoose.Types.ObjectId(id);

        const user = await User.findById(objectId).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        // Replace the admin block in getUserDashboard with this:
if (user.role === "admin") {
    const totalJobsPosted = await Job.countDocuments({ postedBy: objectId });
    const myJobs = await Job.find({ postedBy: objectId }, '_id');
    const jobIds = myJobs.map(job => job._id);
    const totalApplicants = await Application.countDocuments({ job: { $in: jobIds } });
    
    // NEW — accepted and pending counts
    const totalAccepted = await Application.countDocuments({ 
        job: { $in: jobIds }, status: "Accepted" 
    });
    const totalPending = await Application.countDocuments({ 
        job: { $in: jobIds }, status: "Pending" 
    });

    // NEW — recent 5 applications with job + applicant details
    const recentApplications = await Application.find({ job: { $in: jobIds } })
        .populate("applicant", "firstName lastName email")
        .populate("job", "title company")
        .sort({ createdAt: -1 })
        .limit(5);

    return res.status(200).json({
        message: "Welcome to the Recruiter Dashboard",
        stats: { 
            totalJobsPosted, 
            totalApplicants,
            totalAccepted,
            totalPending
        },
        recentApplications,
        user
    });
}
        else {
            const myApplicationsCount = await Application.countDocuments({ applicant: objectId });

            // Profile completion calculation
            const fields = [
                user.firstName, user.lastName, user.email,
                user.bio, user.phone, user.location,
                user.resumeUrl, user.photoUrl,
                user.skills && user.skills.length > 0
            ];
            const filled = fields.filter(Boolean).length;
            const profileCompletion = Math.round((filled / fields.length) * 100);

            return res.status(200).json({
                message: "Welcome to the Candidate Dashboard",
                stats: {
                    appliedJobs: myApplicationsCount,
                    profileCompletion: `${profileCompletion}%`
                },
                user
            });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


exports.getUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


exports.updateUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, bio, phone, location, skills, photoUrl, resumeUrl } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { firstName, lastName, bio, phone, location, skills, photoUrl, resumeUrl },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        res.status(200).json({
            message: "Profile updated successfully!",
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};