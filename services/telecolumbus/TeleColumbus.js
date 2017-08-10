const SpeedLog = require('../../models/SpeedLog');
const Observable = require('zen-observable');

class TeleColumbus {

    /**
     * @param {SpeedTest} speedTest
     * @param {Number} interval
     * @param {Log} log
     * @param {Twitter} twitter
     * @param {Number} tweetInterval
     * @param {Number} speedPaidFor
     * @param {Number} [tweetSpeedThreshold=50]
     */
    constructor(speedTest, interval, log, twitter, tweetInterval, speedPaidFor, tweetSpeedThreshold) {
        this.speedTest = speedTest;
        this.interval = interval;
        this.tweetInterval = tweetInterval;
        this.speedPaidFor = speedPaidFor;
        this.tweetThreshold = tweetSpeedThreshold || 50;
        this.twitter = twitter;
        this.log = log;
    }

    /**
     * @public
     * @return {Observable}
     */
    start() {
        return this.getObservableSpeedTest().map(
            (result) => {
                result['speedPercentage'] = result.speed / this.speedPaidFor;
                return TeleColumbus.saveSpeedTestResultToDatabase(result)
                    .then(result => {
                        this.log.log('Saved SpeedLog to DB: ', result);
                        this.tweetIfNecessary()
                        return result;
                    })
                    .catch((err) => {
                        this.log.error('COULD NOT SAVE RESULT TO DB: ', err);
                    })
            }
        )
    }

    /**
     * @public
     */
    stop() {
        if (!this.timerInterval) {
            this.log.error('Cannot stop Service. It has not been started');
        }
        clearInterval(this.timerInterval);
    }

    /**
     * @private
     * @return {Observable}
     */
    getObservableSpeedTest() {
        return new Observable(observer => {

            let speedTester = () => {
                this.speedTest.doSpeedTest()
                    .then((result) => {
                        observer.next(result);
                    })
            };

            this.timerInterval = setInterval(speedTester, this.interval);
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
        let date = new Date(millis - this.tweetInterval);
        SpeedLog.findOne({createdAt: {$gt: date}, tweeted: true})
        // if we can't find any SpeedLog within the tweetInterval that has been tweeted
            .then(result => {
                return result === null
            })
            // then we should find the latest SpeedLog that was created in the last tweetInterval
            .then(shouldTweet => shouldTweet
                ? SpeedLog.findSlowerThanPercentageAndNewerThanDateNotTweeted(this.tweetThreshold, date)
                : null
            )
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
        return `Meine Downloadgeschwindigkeit beträgt aktuell nur ${speedLog.speed}Mbit/s obwohl mein Tarif ${this.speedPaidFor}Mbit/s vorsieht. Das ist nicht gut`;
    }
}

module.exports = TeleColumbus;