const mongoose = require('mongoose')

const mobileValidation = function (mobile) {
    let regexForMobile = /^([+]\d{2})?\d{10}$/
    return regexForMobile.test(mobile)
}

const userSchema = new mongoose.Schema({
    title: {
        type: String,
        enum: ['Mr', 'Mrs', 'Miss'],
        requried: 'title is required'
    },
    name: {
        type: String,
        requried: 'Name is Mandatory',
        trim: true
    },
    phone: {
        type: String,
        requried: true,
        unique: true,
        Validate: [mobileValidation, "please enter a valid mobile number"],
        trim: true
    },
    email: {
        type: String,
        requried: true,
        trim:true,
        match: [/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/, 'Please fill a valid email address'],
        Unique: true
    },
    password: {
        type: String,
        requried: true,
        Unique: true,
        minLen: 8,
        maxLen: 15
    },
    address: {
        street: {
            type: String,
            requried: true,

        },
        city: { type: String },

        pincode: { type: String }
    }
}, { timestamps: true })


module.exports = mongoose.model('User', userSchema)
