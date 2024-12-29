const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
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
        enum: ['Admin', 'User'],
        default: 'User'
    },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    subscriptionStartDate: {
        type: Date
    },
    subscriptionEndDate: {
        type: Date
    },
    package: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Package'
    },
    profileImageUrl: { // שדה חדש לתמונת פרופיל
        type: String,
        default: null
    }
},

    {
        timestamps: true
    }
);

module.exports = mongoose.model('User', userSchema);
