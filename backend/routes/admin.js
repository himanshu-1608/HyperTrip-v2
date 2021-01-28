
const express = require('express');

const isAuth = require('../middlewares/isAuth');
const isAdmin = require('../middlewares/isAdmin');
const adminControllers = require('../controllers/admin');

const router = express.Router();

router.post('/add-bus', isAuth, isAdmin, adminControllers.postAddBus);

router.get('/admin-buses', isAuth, isAdmin, adminControllers.getBuses);

router.post('/reset', isAuth, isAdmin, adminControllers.postReset);

module.exports = router;