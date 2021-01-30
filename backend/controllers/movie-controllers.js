const movieUtils = require('../utils/db-utils/movie-utils');

exports.getAllMovies = async (req, res, next) => {
  try {
    const movies = await movieUtils.findAllMovies();
    if (!movies) throw new Error('No Movies Found!');
    res.status(200).json({
      message: 'Movies fetched successfully',
      success: true,
      movies: movies,
    });
  } catch (error) {
    error.statusCode = 500;
    error.message = error.message || 'Fetching all movies failed';
    return next(error);
  }
};

exports.getSearchedMovies = async (req, res, next) => {
  try {
    const { name, movieDate } = req.body;
    const movies = await movieUtils.findMovieBySpecificFields(name, movieDate);
    if (!movies) throw new Error('Could not find Movies');
    res.status(200).json({
      message: 'Movies fetched successfully',
      success: true,
      movies: movies,
    });
  } catch (error) {
    error.statusCode = 500;
    error.message = error.message || 'Fetching movies by fields failed';
    return next(error);
  }
};

exports.getBookedSeats = async (req, res, next) => {
  try {
    const movieId = req.params.movieId;
    const movie = await movieUtils.findMovieById(movieId);
    if (!movie) throw new Error('Could not find movie by ID');

    res.status(200).json({
      message: 'Seats fetched successfully',
      success: true,
      bookedSeats: movie.bookedSeats,
    });
  } catch (error) {
    error.statusCode = 500;
    error.message = error.message || 'Fetching booked seats failed';
    return next(error);
  }
};
