const User = require("./User");

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const checkoutSchema = new Schema(
    {
        date: {
            type: String,
            required: true,
        },

        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
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

        phoneNumber: {
            type: String,
            required: true,
        },

        products: [
            {
                product: {
                    ref: "Product",
                    type: Schema.Types.ObjectId,
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

        status: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Checkout", checkoutSchema);
