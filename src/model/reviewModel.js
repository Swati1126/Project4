const mongoose = require("mongoose")

const reviewSchema = mongoose.Schema({
    bookId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true
    },
    reviewedBy:{
        type: String,
        default:"Guest"
    },
    reviewedAt:{
        type: Date,
        required: true,
    },
    rating:{
        type:Number,
        match: [/^[1-5]$/,"Please enter correct rating"],
        required: true
    },
    review: String,
    isDeleted:{
        type: Boolean,
        default: false
    }

},{timestamps: true})

module.exports = mongoose.model("Review", reviewSchema)