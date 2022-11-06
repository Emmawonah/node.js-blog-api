const mongoose = require("mongoose");

const PostSchema = mongoose.Schema(
    {
        authorName: {
            type: String,
        },
        title: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
        },
        state: {
            type: String,
            default: "draft",
            enum: ["draft", "published"],
        },
        read_count: {
            type: Number,
            default: 0,
        },
        reading_time: {
            type: String,
        },
        tags: {
            type: String,
        },
        body: {
            type: String,
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);
const PostModel = mongoose.model("Post", PostSchema)
module.exports = PostModel
