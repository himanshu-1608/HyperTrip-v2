const ticketUtils = require('../utils/db-utils/ticket-utils');
const movieUtils = require('../utils/db-utils/movie-utils');

exports.postBookTicket = async (req, res, next) => {
  try {
    const movieInfo = req.body.movieId;
    const bookedBy = req.userId;
    const selectedSeats = [...req.body.selectedSeats];
    const tickets = selectedSeats.map((seat) => {
      return {
        number: seat,
        bookedBy: bookedBy,
        movieInfo: movieInfo,
      };
    });
    const createdTickets = await ticketUtils.createMany(tickets);
    if (!createdTickets) throw new Error('Error while creating tickets');
    const movie = await movieUtils.findMovieById(req.body.movieId);
    const updatedBookedSeats = [...movie.bookedSeats, ...createdTickets];
    movie.bookedSeats = updatedBookedSeats;
    await movieUtils.saveMovie(movie);

    res.status(201).json({
      message: 'Tickets booked successfully',
      success: true,
    });
  } catch (error) {
    error.statusCode = 500;
    error.message = error.message || 'Booking ticket failed!';
    return next(error);
  }
};
