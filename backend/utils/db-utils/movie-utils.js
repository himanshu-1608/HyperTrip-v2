const Movie = require('../../models/movie');

exports.createMovie = async (movieDetails) => {
  try {
    let createdMovie = new Movie(movieDetails);
    createdMovie = await createdMovie.save();
    return createdMovie;
  } catch (error) {
    throw new Error('DB error while creating movie!');
  }
};

exports.findMoviesCreatedByAdmin = async (adminId) => {
  try {
    const movies = await Movie.find({ createdBy: adminId }).limit(10);
    return movies;
  } catch (error) {
    throw new Error('DB error while finding movies by admin!');
  }
};

exports.findAllMovies = async () => {
  try {
    const movies = await Movie.find().limit(20);
    return movies;
  } catch (error) {
    throw new Error('DB error while finding all movies!');
  }
};

exports.findMovieBySpecificFields = async (
  movieStartTime,
  movieEndTime,
  movieDate
) => {
  try {
    let movies;
    if (
      movieStartTime.trim() !== '' &&
      movieEndTime.trim() !== '' &&
      movieDate.trim() !== ''
    ) {
      movies = await Movie.find({
        movieStartTime: movieStartTime,
        movieEndTime: movieEndTime,
        movieDate: movieDate,
      }).limit(20);
    } else if (movieStartTime.trim() !== '' && movieEndTime.trim() !== '') {
      movies = await Movie.find({
        movieStartTime: movieStartTime,
        movieEndTime: movieEndTime,
      }).limit(20);
    } else if (movieStartTime.trim() !== '' && movieDate.trim() !== '') {
      movies = await Movie.find({
        movieStartTime: movieStartTime,
        movieDate: movieDate,
      }).limit(20);
    } else if (movieEndTime.trim() !== '' && movieDate.trim() !== '') {
      buses = await Movie.find({
        movieEndTime: movieEndTime,
        movieDate: movieDate,
      }).limit(20);
    } else if (movieStartTime.trim() !== '') {
      movies = await Movie.find({
        movieStartTime: movieStartTime,
      }).limit(20);
    } else if (movieEndTime.trim() !== '') {
      movies = await Movie.find({
        movieEndTime: movieEndTime,
      }).limit(20);
    } else if (movieDate.trim() !== '') {
      movies = await Movie.find({
        movieDate: movieDate,
      }).limit(20);
    }
    return movies;
  } catch (error) {
    throw new Error('DB error while finding movies by parameters!');
  }
};

exports.findMovieById = async (movieId) => {
  try {
    const movie = await Movie.findById(movieId)
      .populate({ path: 'bookedSeats', populate: 'bookedBy' })
      .exec();
    return movie;
  } catch (error) {
    throw new Error('DB error while finding Movie by id!');
  }
};

exports.saveMovie = async (movie) => {
  try {
    await movie.save();
  } catch (error) {
    throw new Error('DB error while saving movie!');
  }
};
