const mongoose = require("mongoose")

const bookSchema = mongoose.Schema({
    
    title: {
        type: String,
        require: "enter title of book",
        unique: true
    },
    excerpt: {
        type: String,
        require: "enter excerpt for book"
    }, 
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        require: "please enter user id",
        ref: "User"
    },
    ISBN: {
        type: String,
        require: "please enter ISBN",
        unique: true
    },
    category: {
        type: String,
        require: "please enter category"
    },
    subcategory: {
        type: [String],
        require: "please enter subcategory"
    },
    reviews: {
        type: Number,
        default: 0
    },
    deletedAt: {
        type: String,
        default: " "
    }, 
    isDeleted: {
        type: Boolean,
        default: false
    },
    releasedAt: {
        type: Date,
        required: true
    } 
}, {timestamps: true});

module.exports = mongoose.model("Book", bookSchema)
