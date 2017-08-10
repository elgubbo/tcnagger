class TwitterConfig {
    /**
     * @param config
     * @param {Twit} config.twit - a correctly configured Twit instance
     * @param {Number} config.minglingInterval - the interval at which this bot should mingle when started
     * @param {Number} config.pruneInterval - the interval at which this bot should prune when started
     */
    constructor(config) {
        this._twit = config.twit || null;
        this._minglingInterval = config.minglingInterval || 60 * 60 * 60;
        this._pruneInterval = config.pruneInterval || 60 * 60 * 60;
    }

    get pruneInterval() {
        return this._pruneInterval;
    }

    get minglingInterval() {
        return this._minglingInterval;
    }

    get twit() {
        return this._twit;
    }
}

module.exports = TwitterConfig;