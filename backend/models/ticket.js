
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ticketSchema = new Schema({
    number: {
        type: Number,
        required: true
    },
    bookedBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }, 
    busInfo: {
        type: mongoose.Types.ObjectId,
        ref: 'Bus'
    }
});

module.exports = mongoose.model('Ticket', ticketSchema);