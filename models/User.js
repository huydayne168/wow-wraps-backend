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
    avatar: {
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
    isAdmin: {
        type: Boolean,
        required: true,
    },
});

module.exports = mongoose.model("User", userSchema);
