
const assert = require('assert');
const mongoose = require('mongoose');

const { MONGODB_TEST_URI } = require('../config');
const adminControllers = require('../controllers/admin');

mongoose.connect(MONGODB_TEST_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected!'))
  .catch((err) => {
    console.log('MongoDB Connection Error: ', err);
  });

const next = (error) => {
  // console.log('Error in next:', error);
};

describe('Unit Tests: Test for controllers/bus.js:', () => {
  let res;
  beforeEach('res should be some fresh object', () => {
    res = {
      statusCode: 0,
      body: {},
      status: (code) => {
        res.statusCode = code;
        return res;
      },
      json: (result) => {
        res.body = result;
        return res;
      },
    };
  });

  it('should add a bus', function (done) {
    let req = {
      body: {
        name: 'Haryana Roadways',
        number: 'HR3425',
        startCity: 'Delhi',
        endCity: 'Chandigarh',
        journeyDate: '2021-01-27',
        fare: '250',
        departureTime: '10:00',
        arrivalTime: '13:00'
      },
      userId: '600a5f3ea8cfa13b54cc9668'
    };
    adminControllers.postAddBus(req, res, next)
      .then(function() {
          assert.ok(res.statusCode === 201);
          assert.ok(res.body.success === true);
          done();
      })
      .catch(err => {
        done(new Error('Error in creating a bus'));
      });
  });

  it('should fail to add a bus(Bus number should be provided)', function (done){
    let req = {
      body: {
        name: 'Haryana Roadways',
        startCity: 'Delhi',
        endCity: 'Chandigarh',
        journeyDate: '2021-01-27',
        fare: '250',
        departureTime: '10:00',
        arrivalTime: '13:00'
      },
      userId: '600a5f3ea8cfa13b54cc9668'
    };
    adminControllers.postAddBus(req, res, next)
      .then(function() {
        assert.ok(res.statusCode === 201);
        assert.ok(res.body && res.body.success === true);
        done(new Error('New Bus is created without required field!'));
      })
      .catch(function (err) {
        done();
      });
  });
});
