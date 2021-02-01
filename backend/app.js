const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth-routes');
const movieRoutes = require('./routes/movie-routes');
const ticketRoutes = require('./routes/ticket-routes');
const adminRoutes = require('./routes/admin-routes');
const { MONGODB_URI } = require('./config');

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/movie', movieRoutes);
app.use('/ticket', ticketRoutes);
app.use('/admin', adminRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({
    message: message,
    success: false,
    data: data,
  });
});

const startServer = () => {
  app.listen(8080);
  console.log('Server Running!');
};

const connectMongoose = () => {
  mongoose
    .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log('Mongoose Connected!');
      startServer();
    })
    .catch((error) => console.log(error));
};

if (require.main === module) {
  connectMongoose();
}

module.exports = app;
