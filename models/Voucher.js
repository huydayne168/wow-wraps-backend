const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const voucherSchema = new Schema(
    {
        code: {
            type: String,
            required: true,
        },

        discountPercent: {
            type: Number,
            required: true,
        },

        quantity: {
            type: Number,
            required: true,
        },

        end: {
            type: String,
            required: true,
        },

        isDeleted: {
            type: Boolean,
            required: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Voucher", voucherSchema);
