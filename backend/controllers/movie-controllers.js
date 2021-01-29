const userUtils = require('../utils/db-utils/user-utils');
const movieUtils = require('../utils/db-utils/movie-utils');

exports.getAllBuses = async (req, res, next) => {
  try {
    const buses = await busUtils.findAllBuses();
    if (!buses) throw new Error('Some db error');
    res.status(200).json({
      message: 'Buses fetched successfully',
      success: true,
      buses: buses,
    });
  } catch (error) {
    error.statusCode = 500;
    error.message = error.message || 'Fetching all buses failed';
    return next(error);
  }
};

exports.getSearchedBuses = async (req, res, next) => {
  try {
    const { startCity, endCity, journeyDate } = req.body;
    const buses = await busUtils.findBusBySpecificFields(
      startCity,
      endCity,
      journeyDate
    );
    if (!buses) throw new Error('Cannot find buses for given fields');
    res.status(200).json({
      message: 'Buses fetched successfully',
      success: true,
      buses: buses,
    });
  } catch (error) {
    error.statusCode = 500;
    error.message = error.message || 'Fetching buses by fields failed';
    return next(error);
  }
};

exports.getBookedSeats = async (req, res, next) => {
  try {
    const busId = req.params.busId;
    const bus = await busUtils.findBusById(busId);
    if (!bus) {
      throw new Error('Some db error');
    }

    res.status(200).json({
      message: 'Seats fetched successfully',
      success: true,
      bookedSeats: bus.bookedSeats,
    });
  } catch (error) {
    error.statusCode = 500;
    error.message = error.message || 'Fetching booked seats failed';
    return next(error);
  }
};
