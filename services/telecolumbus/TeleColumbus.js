const SpeedLog = require('../../models/SpeedLog');
const Observable = require('zen-observable');
const BaseService = require('../BaseService');

class TeleColumbus extends BaseService {

    /**
     * @param config
     */
    constructor(config) {
        super(config.log);
        let {speedTest, interval, twitter, tweetInterval, speedPaidFor, tweetSpeedThreshold} = config;
        this._speedTest = speedTest;
        this._interval = interval;
        this._tweetInterval = tweetInterval;
        this._speedPaidFor = speedPaidFor;
        this._tweetThreshold = tweetSpeedThreshold || 50;
        this._twitter = twitter;
    }

    /**
     * @public
     * @return {Observable}
     */
    start() {
        this._observable = this.getObservableSpeedTest().map(
            (result) => {
                result['speedPercentage'] = result.speed / this._speedPaidFor;
                return TeleColumbus.saveSpeedTestResultToDatabase(result)
                    .then(result => {
                        this.log.log('Saved SpeedLog to DB: ', result);
                        this.tweetIfNecessary();
                        return result;
                    })
                    .catch((err) => {
                        this.log.error('COULD NOT SAVE RESULT TO DB: ', err);
                    })
            }
        );
        return super.start();
    }

    /**
     * @private
     * @return {Observable}
     */
    getObservableSpeedTest() {
        return new Observable(observer => {
            this._observer = observer;
            let speedTester = () => {
                this.speedTest.doSpeedTest()
                    .then((result) => {
                        observer.next(result);
                    })
            };

            this._timerInterval = setInterval(speedTester, this.interval);
        });
    }

    /**
     * @public
     * @param {Object} result
     */
    static saveSpeedTestResultToDatabase(result) {
        let speedLog = new SpeedLog({
            'speed': result.speed,
            'testUrl': result.url,
            'speedPercentage': result.speedPercentage
        });
        return speedLog.save();
    }

    /**
     * @private
     */
    tweetIfNecessary() {
        let currentDate = new Date();
        let millis = currentDate.valueOf();
        let date = new Date(millis - this._tweetInterval);
        SpeedLog.findSlowerThanPercentageAndNewerThanDateNotTweeted(this._tweetThreshold, date)
            // and tweet it
            .then(speedLog => this.tweetSpeedLog(speedLog))
            .catch(err => this.log.error('TeleColumbus: there has been an error while tweeting:', err))
    }

    /**
     *
     * @param speedLog
     * @return {Promise|null}
     */
    tweetSpeedLog(speedLog) {
        if (speedLog) {
            const tweet = this.compileTweet(speedLog);
            this.log.log(tweet);
            /*            this.twitter.tweet(tweet)
                            .then(_ => {
                                speedLog.tweeted = true;
                                speedLog.save();
                            })*/
        }
        return null;
    }

    /**
     * @private
     * @param speedLog
     * @return {String}
     */
    compileTweet(speedLog) {
        return `Meine Downloadgeschwindigkeit beträgt aktuell nur ${speedLog.speed}Mbit/s obwohl mein Tarif ${this._speedPaidFor}Mbit/s vorsieht. Das ist nicht gut`;
    }

    get speedTest() {
        return this._speedTest;
    }

    get interval() {
        return this._interval;
    }

    get tweetInterval() {
        return this._tweetInterval;
    }

    get speedPaidFor() {
        return this._speedPaidFor;
    }

    get tweetThreshold() {
        return this._tweetThreshold;
    }

    get twitter() {
        return this._twitter;
    }
}

module.exports = TeleColumbus;