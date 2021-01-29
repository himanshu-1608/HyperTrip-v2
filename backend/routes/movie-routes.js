const express = require('express');

const isAuth = require('../middlewares/isAuth');
const movieControllers = require('../controllers/movie-controllers');

const router = express.Router();

router.get('/movies', isAuth, movieControllers.getAllMovies);

router.post('/search-movie', isAuth, movieControllers.getSearchedMovies);

router.get('/booked-seats/:movieId', isAuth, movieControllers.getBookedSeats);

module.exports = router;
