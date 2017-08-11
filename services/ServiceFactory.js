const TwitterBot = require('./twitter/TwitterBot');
const Twitter = require('./twitter/Twitter');
const TeleColumbus = require('./telecolumbus/TeleColumbus');
const SpeedTest = require('./speedtest/SpeedTest');
const SpeedTestConfig = require('./speedtest/SpeedTestConfig');
const Twit = require('twit');
const Log = require('../helpers/Log');

class ServiceFactory {

    /**
     * @param config
     */
    constructor(config) {
        this._config = config;
    }

    get speedTest() {
        if (!this._speedTest) {
            this.createSpeedTest();
        }
        return this._speedTest;
    }

    get speedTestConfig() {
        if (!this._speedTestConfig) {
            this.createSpeedTestConfig();
        }
        return this._speedTestConfig;
    }

    get teleColumbus() {
        if (!this._teleColumbus) {
            this.createTeleColumbus();
        }
        return this._teleColumbus;
    }

    get twitter() {
        if (!this._twitter) {
            this.createTwitter();
        }
        return this._twitter;
    }

    get twitterBot() {
        if (!this._twitterBot) {
            this.createTwitterBot();
        }
        return this._twitterBot;
    }

    get twit() {
        if (!this._twit) {
            this.createTwit();
        }
        return this._twit;
    }

    get config() {
        return this._config;
    }

    set config(value) {
        // dont to anything
    }

    createTwitterBot() {
        const twitter = this.twitter;
        let {actionInterval, pruneToMingleRatio} = this.config.twitterBot;
        this._twitterBot = new TwitterBot(twitter, actionInterval, pruneToMingleRatio);
    }

    createTwitter() {
        const twit = this.twit;
        this._twitter = new Twitter(twit);
    }

    createTwit() {
        this._twit = new Twit(this.config.twit);
    }

    createTeleColumbus() {
        let config = {
            speedTest: this.speedTest,
            log: new Log(true),
            twitter: this.twitter
        };
        config = Object.assign(config, this.config.teleColumbus);
        this._teleColumbus = new TeleColumbus(config);
    }

    createSpeedTestConfig() {
        this._speedTestConfig = new SpeedTestConfig(this.config.speedTest);
    }

    createSpeedTest() {
        this._speedTest = new SpeedTest(this.speedTestConfig);
    }
}

module.exports = ServiceFactory;