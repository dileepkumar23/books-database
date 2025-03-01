const mongoose = require("mongoose")

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    publishedYear: {
        type: Number,
        required: true
    },
    genre: {
        type: [String],
        required: true
    },
    language: String,
    country: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    summary: String,
    coverImageUrl: String
},
{
    timestamps: true
})

const Books = mongoose.model("Books", bookSchema)

module.exports = Books