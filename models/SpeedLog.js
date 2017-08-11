const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SpeedLogSchema = new Schema({
    speed: Number,
    testUrl: String,
    tweeted: {type: Boolean, default: false},
    error: String,
    speedPercentage: Number
});
SpeedLogSchema.set('timestamps', true);

/**
 * @public
 * @param {Number} percentage
 * @param {Date} date
 * @return {Promise}
 */
SpeedLogSchema.statics.findSlowerThanPercentageAndNewerThanDateNotTweeted = function (percentage, date) {
    return this.findOne({
        speedPercentage: {$lt: percentage},
        tweeted: false,
        createdAt: {$gt: date}
    })
};

// Compile model from schema
const SpeedLog = mongoose.model('SpeedLog', SpeedLogSchema);
module.exports = SpeedLog;