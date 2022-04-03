var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const session = require("express-session");
const passport = require('passport')
const LocalStrategy = require("passport-local").Strategy;
const MongoStore = require('connect-mongo');
const crypto = require('crypto')
require('dotenv').config();

const connectionUrl = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.iz1vu.mongodb.net/project-members-only?retryWrites=true&w=majority`
mongoose.connect(connectionUrl, { useUnifiedTopology: true, useNewUrlParser: true });
const sessionStore = MongoStore.create({
  mongoUrl: connectionUrl,
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));


var indexRouter = require('./routes/index');
const User = require('./models/User');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
}));
app.use(express.urlencoded({ extended: false }));

function validPassword(password, hash, salt) {
  const hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');
  return hash === hashVerify;
}

passport.use(new LocalStrategy(
  function (username, password, cb) {
    User.findOne({ username: username })
      .then(user => {
        if (!user) { return cb(null, false) }

        const isValid = validPassword(password, user.hash, user.salt);

        if (isValid) {
          return cb(null, user)
        } else {
          return cb(null, false)
        }

      })
      .catch(err => {
        cb(err);
      })
  }
))

passport.serializeUser(function (user, cb) {
  cb(null, user.id);
}) 

passport.deserializeUser(function (id, cb) {
  User.findById(id, function (err, user) {
    if (err) { return next(err) }
    cb(null, user);
  })
})

app.use(passport.initialize());
app.use(passport.session());





app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
