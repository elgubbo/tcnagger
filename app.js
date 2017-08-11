const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('app-config');

//services
const Log = require('./helpers/Log');
const ServiceFactory = require('./services/ServiceFactory');

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

// setup services TODO this has to move somewhere else
let serviceFactoryConfig = Object.assign({}, config.twitter, config.services);
app.services = new ServiceFactory(serviceFactoryConfig);
let teleColumbus = app.services.teleColumbus;
teleColumbus.log = app.log;
teleColumbus.observable.subscribe({
    next(res) {
        res.then((res) => {
            app.log.log('SpeedTest Done with result:');
            console.log(res.speed);
        })
    },
    error(err) {
        app.log.log(`Finished with error: `, err)
    },
    complete() {
        app.log.log("Finished")
    }
});

let twitterBot = app.services.twitterBot;
twitterBot.log = app.log;
twitterBot.observable.subscribe({
    next(res) {
        app.log.log('Pruned/mingled with result:');
        app.log.log(res);
    },
    error(err) {
        app.log.log(`Finished with error: `, err)
    },
    complete() {
        app.log.log("Finished TwitterBot")
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
