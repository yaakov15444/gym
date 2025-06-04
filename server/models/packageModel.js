const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    price: {
        type: Number,
        required: true
    },
    durationInMonths: {
        type: Number,
        required: true // משך זמן החבילה בחודשים
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Package', packageSchema);
