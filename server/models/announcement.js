const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        default: null
    },

    isActive: {
        type: Boolean,
        default: true
    },
    expirationDate: {
        type: Date,
        required: false,
        default: null
    }
},
    {
        timestamps: true,
        strict: true
    }
);


const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = Announcement;
