const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const movieSchema = new Schema({
  name: { type: String, required: true },

  cinemaName: { type: String, required: true, maxlength: 15 },

  movieDate: { type: String, required: true },

  ticketCharge: { type: Number, required: true },

  movieStartTime: { type: String, required: true },

  movieEndTime: { type: String, required: true },

  bookedSeats: [{ type: mongoose.Types.ObjectId, ref: 'Ticket' }],

  createdBy: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Movie', movieSchema);
