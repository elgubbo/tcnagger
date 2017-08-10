const express = require('express');
const router = express.Router();
const SpeedLog = require('../models/SpeedLog');

/* GET home page. */
router.get('/', function (req, res, next) {
    SpeedLog.find({}).sort([['createdAt', -1]]).exec().then((speedLogs) => {
        res.render('index', {
            title: 'SpeedLog',
            speedLogs
        });
    });
});

module.exports = router;
