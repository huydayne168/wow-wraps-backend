const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const FlashSaleSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },

        discountPercent: {
            type: Number,
            required: true,
        },

        start: {
            type: String,
            required: true,
        },

        end: {
            type: String,
            required: true,
        },

        products: [
            {
                type: Schema.Types.ObjectId,
                ref: "Product",
            },
        ],

        isActive: {
            type: Boolean,
            required: true,
        },

        isOver: {
            type: Boolean,
            required: true,
        },

        isDelete: {
            type: Boolean,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("FlashSale", FlashSaleSchema);
