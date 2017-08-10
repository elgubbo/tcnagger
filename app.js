const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Twit = require('twit');
const config = require('app-config');

const Log = require('./helpers/Log');
//services
const TeleColumbusService = require('./services/telecolumbus/TeleColumbus');
const SpeedTestConfig = require('./services/speedtest/SpeedTestConfig');
const SpeedTest = require('./services/speedtest/SpeedTest');
const TwitterConfig = require('./services/twitter/TwitterConfig');
const Twitter = require('./services/twitter/Twitter');

// Routes
const index = require('./routes/index');
const users = require('./routes/users');


let app = express();

// set devmode
app.set('devMode', app.get('env') === 'development');
// setup logging
app.log = new Log(app.get('devMode'));
app.log.log(app.get('env'));

// db setup
mongoose.Promise = global.Promise;
mongoose.connect(config.db.mongoUri, {
    useMongoClient: true,

});
const db = mongoose.connection;
db.on('error', app.log.error.bind(app.log, 'MongoDB connection error:'));

//setup twitter
let twit = new Twit(config.twitter.twit);
let twitterConfig = new TwitterConfig({
    twit,
    mingleInterval: config.twitter.mingleInterval,
    pruneInterval: config.twitter.pruneInterval
});
let twitter = new Twitter(twitterConfig);
//setup speedTest
let fastComConfig = new SpeedTestConfig({
    url: 'http://fast.com',
    resultSelector: '#speed-value'
});
let fastCom = new SpeedTest(fastComConfig);
let fastComTc = new TeleColumbusService(fastCom, 60*60*10, app.log, twitter, 60*60*60, 120, 50);
let fastComTcObservable = fastComTc.start();
fastComTcObservable.subscribe({
    next(res) {
        res.then((res) => {
            app.log.log('SpeedTest Done with result:');
            console.log(res);
        })
    },
    error(err) {
        console.log(`Finished with error: `, err)
    },
    complete() {
        console.log("Finished")
    }
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in dev
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;
