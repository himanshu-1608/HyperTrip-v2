const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ticketSchema = new Schema({
  number: { type: Number, required: true },
  bookedBy: { type: mongoose.Types.ObjectId, ref: 'User' },
  movieInfo: { type: mongoose.Types.ObjectId, ref: 'Movie' },
});

module.exports = mongoose.model('Ticket', ticketSchema);
