const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
    {
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
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Category",
        },
        tags: [
            {
                type: Schema.Types.ObjectId,
                required: true,
                ref: "Tag",
            },
        ],
        reviews: [
            {
                date: {
                    type: String,
                    required: true,
                },
                comment: {
                    type: String,
                    required: true,
                },
                ratePoint: {
                    type: Number,
                    required: true,
                },
                user: {
                    type: Schema.Types.ObjectId,
                    required: true,
                    ref: "User",
                },
            },
        ],

        image: {
            type: String,
            required: true,
        },

        flashSale: [
            {
                type: Schema.Types.ObjectId,
                ref: "FlashSale",
                required: true,
            },
        ],

        salePrice: {
            type: Number,
            // required: true,
        },

        isDeleted: {
            type: Boolean,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
