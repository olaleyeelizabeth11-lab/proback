const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
    job: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Job", 
        required: true 
    },
    applicant: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    resumeLink: { type: String }, // You can put a URL here for now
    status: { 
        type: String, 
        enum: ["Pending", "Accepted", "Rejected"], 
        default: "Pending" 
    }
}, { timestamps: true });

module.exports = mongoose.model("Application", applicationSchema);