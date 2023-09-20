const mongoose = require("mongoose");
const Review = require("./Review");
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    amount: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    rate: {
        type: String,
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
        type: Object,
        required: true,
    },
});

module.exports = mongoose.model("Product", productSchema);
