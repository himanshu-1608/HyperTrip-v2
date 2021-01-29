const movieUtils = require('../utils/db-utils/movie-utils');
const ticketUtils = require('../utils/db-utils/ticket-utils');

exports.postAddMovie = async (req, res, next) => {
  let createdBy, movieDetails, createdMovie;
  try {
    const {
      name,
      cinemaName,
      movieDate,
      ticketCharge,
      movieStartTime,
      movieEndTime,
    } = req.body;
    createdBy = req.userId;
    movieDetails = {
      name,
      cinemaName,
      movieDate,
      ticketCharge,
      movieStartTime,
      movieEndTime,
      bookedSeats: [],
      createdBy,
    };

    createdMovie = await movieUtils.createMovie(movieDetails);
    res.status(201).json({
      message: 'Movie added successfully',
      success: true,
      createdMovie: createdMovie,
    });
  } catch (error) {
    error.statusCode = 500;
    error.message = error.message || 'Error in creating Movie';
    return next(error);
  }
};

exports.getMovies = async (req, res, next) => {
  try {
    const adminId = req.userId;
    const movies = await movieUtils.findMoviesCreatedByAdmin(adminId);
    res.status(200).json({
      message: 'Movies fetched successfullly.',
      success: true,
      movies: movies,
    });
  } catch (error) {
    error.statusCode = 500;
    error.message = error.message || 'Fetching movies failed';
    return next(error);
  }
};

exports.postReset = async (req, res, next) => {
  try {
    const movieId = req.body.movieId;
    const movieToReset = await movieUtils.findMovieById(movieId);
    if (!movieToReset) throw new Error('Movie(to reset) not found!');
    await ticketUtils.deleteManyTickets(movieToReset.bookedSeats);
    res.status(200).json({
      message: 'Movie tickets reset successfully',
      success: true,
    });
  } catch (error) {
    error.statusCode = 500;
    error.message = error.message || 'Deleting tickets failed';
    return next(error);
  }
};
