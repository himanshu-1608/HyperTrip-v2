
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const busSchema = new Schema({

    name: {
        type: String,
        required: true
    },

    number: {
        type: String,
        required: true,
        maxlength: 15
    },

    startCity: {
        type: String,
        required: true,
        maxlength: 30
    },

    endCity: {
        type: String,
        required: true,
        maxlength: 30
    },

    journeyDate: {
        type: Date,
        required: true
    },

    fare: {
        type: Number,
        required: true
    },

    departureTime: {
        type: String,
        required: true
    },

    arrivalTime: {
        type: String,
        required: true
    },

    bookedSeats: [{
        type: mongoose.Types.ObjectId,
        ref: 'Ticket'
    }],

    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Bus', busSchema);