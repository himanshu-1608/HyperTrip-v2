
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    phoneNo: {
        type: Number,
        required: true,
        minlength: 10,
        maxlength: 10
    },

    gender: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    }
});

module.exports = mongoose.model('User', userSchema);