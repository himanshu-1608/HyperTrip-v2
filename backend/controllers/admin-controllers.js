const busUtils = require('../utils/db-utils/bus');
const ticketUtils = require('../utils/db-utils/ticket');

exports.postAddBus = async (req, res, next) => {
  let createdBy, busDetails, createdBus;
  try {
    const {
      name,
      number,
      startCity,
      endCity,
      fare,
      departureTime,
      arrivalTime,
      journeyDate,
    } = req.body;
    createdBy = req.userId;
    busDetails = {
      name,
      number,
      startCity,
      endCity,
      fare,
      departureTime,
      arrivalTime,
      journeyDate,
      createdBy,
    };

    createdBus = await busUtils.createBus(busDetails);
    res.status(201).json({
      message: 'Bus added successfully',
      success: true,
      createdBus: createdBus,
    });
  } catch (error) {
    error.statusCode = 500;
    error.message = error.message || 'Error in creating Bus';
    return next(error);
  }
};

exports.getBuses = async (req, res, next) => {
  try {
    const adminId = req.userId;
    const buses = await busUtils.findAdminBuses(adminId);
    res.status(200).json({
      message: 'Buses fetched successfullly.',
      success: true,
      buses: buses,
    });
  } catch (error) {
    error.statusCode = 500;
    error.message = error.message || 'Fetching buses failed';
    return next(error);
  }
};

exports.postReset = async (req, res, next) => {
  try {
    const busId = req.body.busId;
    const busToReset = await busUtils.findBusById(busId);
    if (!busToReset) throw new Error('Bus(to reset) not found!');
    await ticketUtils.deleteManyTickets(busToReset.bookedSeats);
    res.status(200).json({
      message: 'Bus tickets reset successfully',
      success: true,
    });
  } catch (error) {
    error.statusCode = 500;
    error.message = error.message || 'Deleting tickets failed';
    return next(error);
  }
};
