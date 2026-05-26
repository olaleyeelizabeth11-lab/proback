const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },       // e.g., "Frontend Developer"
    company: { type: String, required: true },     // e.g., "Tech Solutions Ltd"
    location: { type: String, required: true },    // e.g., "Lagos" or "Remote"
    salary: { type: String },                      // e.g., "₦200,000 - ₦300,000"
    description: { type: String, required: true },
    requirements: { type: [String] },              // An array of strings like ["React", "Node.js"]
    jobType: { 
        type: String, 
        enum: ["Full-time", "Part-time", "Contract", "Internship"],
        default: "Full-time" 
    },
    postedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",                               // Links the job to the Admin User ID
        required: true 
    }
}, { timestamps: true });                          // Automatically adds createdAt and updatedAt

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;