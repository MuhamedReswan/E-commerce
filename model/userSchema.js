const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isBlocked: {
        type: Boolean,
    },

    verified: {
        type: Boolean
    },

    isAdmin: {
        type: Boolean
    }
})


module.exports = mongoose.model("Users", userSchema)