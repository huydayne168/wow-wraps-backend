const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        roomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Message", schema);
