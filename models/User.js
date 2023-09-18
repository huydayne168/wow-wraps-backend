const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
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
    cart: {
        type: Array,
        required: true,
    },
    checkout: {
        type: Array,
        required: true,
    },
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
});

module.exports = mongoose.model("User", userSchema);
