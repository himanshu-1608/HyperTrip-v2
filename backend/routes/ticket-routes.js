const express = require('express');

const isAuth = require('../middlewares/isAuth');
const ticketControllers = require('../controllers/ticket-controllers');

const router = express.Router();

router.post('/book-ticket', isAuth, ticketControllers.postBookTicket);

module.exports = router;
