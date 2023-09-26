const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const checkoutSchema = new Schema({
    date: {
        type: String,
        required: true,
    },
    user: {
        ref: "User",
        _id: Schema.Types.ObjectId,
        required: true,
    },
    receiverName: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    products: [
        {
            product: {
                ref: "Product",
                _id: Schema.Types.ObjectId,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
    paymentMethod: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Review", reviewSchema);
