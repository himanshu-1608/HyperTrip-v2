
const express = require('express');

const isAuth = require('../middlewares/isAuth');
const busControllers = require('../controllers/bus');

const router = express.Router();

router.get('/buses', isAuth, busControllers.getAllBuses);

router.post('/search-bus', isAuth, busControllers.getSearchedBuses);

router.get('/booked-seats/:busId', isAuth, busControllers.getBookedSeats);


module.exports = router;