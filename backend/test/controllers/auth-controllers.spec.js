const assert = require('assert');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const { MONGODB_TEST_URI } = require('../../config');
const { postSignup, postLogin } = require('../../controllers/auth-controllers');

mongoose
  .connect(MONGODB_TEST_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((err) => {
    console.log('Testing Mongo Connection Error: ', err);
  });

const next = (error) => {
  // console.log('Error in next:', error);
};

const commonReq = {
  body: {
    name: 'Random',
    email: `${uuidv4()}@gmail.com`,
    phoneNo: '9876543210',
    gender: 'M',
    password: 'Test@123',
    isAdmin: true,
  },
};

describe('Unit Tests: Test for controllers/auth-controller.js:', () => {
  let req, res;
  beforeEach('req and res should be some fresh objects', () => {
    req = {
      body: {
        name: 'Random',
        email: `${uuidv4()}@gmail.com`,
        phoneNo: '9876543210',
        gender: 'M',
        password: 'Test@123',
        isAdmin: true,
      },
    };

    res = {
      statusCode: 0,
      body: {},
      status: (code) => {
        res.statusCode = code;
        return res;
      },
      json: (data) => {
        res.body = data;
        return res;
      },
    };
  });

  it('should signup a random admin user', function (done) {
    postSignup(req, res, next)
      .then(function () {
        assert.ok(res.statusCode === 201);
        assert.ok(res.body.success && res.body.user);
        done();
      })
      .catch(function (err) {
        done(new Error(`Couldn't signup a random user`));
      });
  });

  it('should signup a unique user', function (done) {
    postSignup(commonReq, res, next)
      .then(function () {
        assert.ok(res.statusCode === 201);
        assert.ok(res.body.success && res.body.user);
        done();
      })
      .catch(function (err) {
        done(new Error(`Couldn't signup user(registred, not removed?!)`));
      });
  });

  it(`shouldn't login local request coz uuid will be unique`, function (done) {
    postLogin(req, res, next)
      .then(function () {
        done();
      })
      .catch(function (err) {
        done(new Error(`Logged in a random user?!`));
      });
  });

  it('should login the common request', function (done) {
    postLogin(commonReq, res, next)
      .then(function () {
        assert.ok(res.statusCode === 200);
        assert.ok(
          res.body.token &&
            res.body.success &&
            res.body.userDetails &&
            res.body.userDetails.id &&
            res.body.userDetails.name.length > 0
        );
        done();
      })
      .catch(function (err) {
        done(new Error(`Couldn't login the common test user!`));
      });
  });
});
