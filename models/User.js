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

        roleId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Role",
        },

        refreshToken: {
            type: String,
            required: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
