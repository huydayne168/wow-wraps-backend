const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        userName: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        cart: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    required: true,
                    ref: "Product",
                },
                quantity: {
                    type: Number,
                    required: true,
                },
            },
        ],
        checkout: [
            {
                type: Schema.Types.ObjectId,
                ref: "Checkout",
            },
        ],
        roles: {
            user: {
                type: String,
                required: false,
            },
            counselor: {
                type: String,
                required: false,
            },
            admin: {
                type: String,
                required: false,
            },
        },
        refreshToken: {
            type: String,
            required: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
