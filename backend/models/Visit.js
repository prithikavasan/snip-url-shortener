const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
    url: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Url"
    },

    visitedAt: {
        type: Date,
        default: Date.now
    },

    browser: {
        type: String,
        default: "Unknown"
    },

    os: {
        type: String,
        default: "Unknown"
    },

    device: {
        type: String,
        default: "Desktop"
    }
});

module.exports = mongoose.model("Visit", visitSchema);