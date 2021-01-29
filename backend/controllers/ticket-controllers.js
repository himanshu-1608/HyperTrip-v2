const ticketUtils = require('../utils/db-utils/ticket-utils');
const movieUtils = require('../utils/db-utils/movie-utils');

exports.postBookTicket = async (req, res, next) => {
  try {
    const busInfo = req.body.busId;
    const bookedBy = req.userId;
    const selectedSeats = [...req.body.selectedSeats];
    const tickets = selectedSeats.map((seat) => {
      return {
        busInfo: busInfo,
        bookedBy: bookedBy,
        number: seat,
      };
    });
    const createdTickets = await ticketUtils.createMany(tickets);
    if (!createdTickets) throw new Error('Error while creating tickets');
    const bus = await busUtils.findBusById(req.body.busId);
    const updatedBookedSeats = [...bus.bookedSeats, ...createdTickets];
    bus.bookedSeats = updatedBookedSeats;
    await busUtils.saveBus(bus);

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

exports.getOwnerOfTicket = async (req, res, next) => {
  try {
  } catch (error) {
    error.statusCode = 500;
    error.message = error.message || 'Could not find owner of ticket!';
    return next(error);
  }
};
