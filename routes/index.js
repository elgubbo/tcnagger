const express = require('express');
const router = express.Router();
const SpeedLog = require('../models/SpeedLog');

/* GET home page. */
router.get('/', function (req, res, next) {
    const teleColumbusRunning = req.app.services.teleColumbus.isRunning;
    const twitterBotRunning = req.app.services.twitterBot.isRunning;
    SpeedLog.find({}).sort([['createdAt', -1]]).exec().then((speedLogs) => {
        res.render('index', {
            title: 'SpeedLog',
            speedLogs,
            teleColumbusRunning,
            twitterBotRunning
        });
    });
});

module.exports = router;
