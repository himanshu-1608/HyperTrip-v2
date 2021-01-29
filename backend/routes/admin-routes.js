const express = require('express');

const isAuth = require('../middlewares/isAuth');
const isAdmin = require('../middlewares/isAdmin');
const adminControllers = require('../controllers/admin-controllers');

const router = express.Router();

router.post('/add-movie', isAuth, isAdmin, adminControllers.postAddMovie);

router.get('/admin-movies', isAuth, isAdmin, adminControllers.getMovies);

router.post('/reset', isAuth, isAdmin, adminControllers.postReset);

module.exports = router;
