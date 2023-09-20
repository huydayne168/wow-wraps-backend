const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    date: {
        type: String,
        required: true,
    },
    reviewContent: {
        type: String,
        required: true,
    },
    rate: {
        type: Number,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Review", reviewSchema);
