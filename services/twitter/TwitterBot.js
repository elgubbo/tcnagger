const Observable = require('zen-observable');
const BaseService = require('../BaseService');

class TwitterBot extends BaseService {

    /**
     * @param {Twitter} twitter
     * @param {Number} actionInterval
     * @param {Number} pruneToMingleRatio - number between 0 and 1
     */
    constructor(twitter, actionInterval, pruneToMingleRatio) {
        super();
        this._twitter = twitter;
        this._actionInterval = actionInterval || 60*60*30;
        this._pruneToMingleRatio = pruneToMingleRatio || 0.5;
    }

    start() {
        this._observable = new Observable(observer => {

            let twitterBotAction = () => {
                this.twitterAction()
                    .then((result) => {
                        observer.next(result);
                    });
            };

            this._timerInterval = setInterval(twitterBotAction, this._actionInterval);
        });
        return super.start();
    }

    /**
     *
     * @return {Promise}
     */
    twitterAction() {
        let randNumber = Math.random();
        if (randNumber >= this._pruneToMingleRatio) {
            return this._twitter.mingle();
        } else {
            return this._twitter.prune();
        }
    }

    /**
     * @return {Twitter}
     */
    get twitter() {
        return this._twitter;
    }

    /**
     * @return {Number|*}
     */
    get actionInterval() {
        return this._actionInterval;
    }
}

module.exports = TwitterBot;