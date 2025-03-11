const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
    score: {
        type: Number,
        required: true
    },
    playerName: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Score', ScoreSchema);