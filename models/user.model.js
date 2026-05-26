const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    
    role: {
        type: String,
        enum: ['user', 'admin'], 
        default: 'user'          
    },

    bio: {
        type: String, 
        default: "" 
    },

    phone: { 
        type: String, 
        default: ""
    },

    location: { 
        type: String, 
        default: "" 
    },

    skills: { 
        type: [String], 
        default: [] 
    },

    photoUrl: {
        type: String, 
        default: "" 
        },

    resumeUrl: { 
        type: String, 
        default: "" 
    },

}, { timestamps: true });

// Export the model
const User = mongoose.model('User', customerSchema);
module.exports = User;