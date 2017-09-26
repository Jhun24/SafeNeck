var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var randomstring = require('randomstring');
var NaverStrategy = require('passport-naver').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google').Strategy;
var passport = require('passport');
var session = require('express-session');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html')
app.set('views', 'views')
app.engine('html', require('ejs').renderFile);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret:'@#@$MYSIGN#@$#$',
    resave: false,
    saveUninitialized:true
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new NaverStrategy({
    clientID: "4IXyyClPOOuvw5cYcUzv",
    clientSecret: "3i3qZjzzgX",
    callbackURL: "http://localhost:3000/auth/naver/callback"

}, function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
        // user = {
        //     name: profile.displayName,
        //     email: profile.emails[0].value,
        //     username: profile.displayName,
        //     provider: 'naver',
        //     naver: profile._json
        // };
        return done(null, profile);
    });
}));

passport.use(new FacebookStrategy({
        clientID: "265369863980600",
        clientSecret: "32f418e9701b1ac4c6f819e50e7d63fe",
        callbackURL: "http://localhost:8080/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ facebookId: profile.id }, function (err, user) {
            return cb(err, user);
        });
    }
));

passport.use(new GoogleStrategy({
        returnURL: 'http://localhost:3000/auth/google/return',
        realm: 'http://localhost:3000/'
    },
    function(identifier, done) {
        User.findByOpenID({ openId: identifier }, function (err, user) {
            return done(err, user);
        });
    }
));

mongoose.connect('mongodb://localhost:27017/no') ;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log("Mongo DB ON");
});

var user = mongoose.Schema({
    name:String,
    id:String,
    password:String,
    token:String,
    age:String,
    sex:String,
    work:String
});

var alarm = mongoose.Schema({
    token:String,
    todayAlarm:Number,
    monthAlarm:Number,
    weekAlarm:Number
});

var userAlarm = mongoose.Schema({
    token:String,
    time:String,
    date:String,
    middleSlope:Number,
    rightSlope:Number,
    leftSlope:Number
});

var setting = mongoose.Schema({
    token:String,
    reportTime:String,
    dailyAward:String,
    weeklyAward:String
});

var userNeck = mongoose.Schema({
    token:String,
    neckSlope:String
});

var neck = mongoose.Schema({
    token:String,
    neckSlope:String
});


var userModel = mongoose.model('userModel',user);
var alarmModel = mongoose.model('alarmModel',alarm);
var settingModel = mongoose.model('settingModel',setting);
var userNeckModel = mongoose.model('userNeckModel',userNeck);
var neckModel = mongoose.model('neckModel',neck);
var userAlarmModel = mongoose.model('userAlarmModel',userAlarm)

require('./routes/auth')(app,randomstring,userModel,passport,session);
require('./routes/alarm')(app, alarmModel , userModel , settingModel , userAlarmModel)
require('./routes/setting')(app,userModel,settingModel);
require('./routes/neck')(app , userModel ,userNeckModel , neckModel , userAlarmModel);
require('./routes/neck')(app , userModel ,userNeckModel , neckModel);

require('./routes/route')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
