const mongoose = require("mongoose");
const Review = require("./Review");
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    rate: {
        type: Number,
        required: true,
    },
    shortDescription: {
        type: String,
        required: true,
    },
    longDescription: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    tags: {
        type: Array,
        required: true,
    },
    reviews: {
        type: Array,
        ref: Review,
    },

    image: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Product", productSchema);
