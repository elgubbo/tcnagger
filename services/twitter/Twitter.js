const co = require('co');

class Twitter {

    /**
     * @param {TwitterConfig} twitterConfig
     */
    constructor(twitterConfig) {
        this._subscriptions = [];
        this._config = twitterConfig;
        this._twit = twitterConfig.twit;
    }

    /**
     * @public
     * @param {Observable <String>} observable - observable that delivers a tweet object
     */
    tweetObservable(observable) {
        let subscription = observable.subscribe((status) => {
            // TODO add logging of failed tweets?
            try {
                this.tweet(status);
            } catch (e) {
                console.error('Twitter: there has been an error while tweeting: ');
                console.dir(e);
            }
        });
        this.subscriptions.push(subscription);
    }

    /**
     * Finds a new TwitterFriend
     * @public
     * @return {Promise}
     */
    mingle() {
        // first get all followers
        return this.twit.get('followers/ids')
            .then((reply) => {
                return reply.ids;
            })
            // then select a random follower and get his followers
            .then(followers => {
                let randomFollower = this.randIndex(followers);
                return this.twit.get('friends/ids', { user_id: randomFollower });
            })
            // then follow a random friend of that follower
            .then(reply => {
                let friendsFollowers = reply.ids;
                let randomFriendOfFriend = this.randIndex(friendsFollowers);
                return this.twit.post('friendships/create', { id: randomFriendOfFriend });
            })
            .catch(err => {
                console.error('Twitter: there has been an error while mingling');
                console.dir(err);
            })
    }

    /**
     * Removes a Friend that does not follow back
     * @returns {Promise}
     */
    prune() {
        let followers = null;
        // first get all followers
        return this.twit.get('followers/ids')
            .then((reply) => {
                followers = reply.ids;
            })
            // then get current Friends
            .then(() => this.twit.get('friends/ids'))
            // then find a friend that is not a follower
            .then((reply) => {
                let friends = reply.ids;
                let pruneTarget = null;

                while(!pruneTarget) {
                    let target = this.randIndex(friends);

                    if(followers.indexOf(target) < 0) {
                        pruneTarget = target;
                    }
                }
                return pruneTarget;
            })
            // then unfollow that friend
            .then(pruneTarget => this.twit.post('friendships/destroy', { id: pruneTarget }))
            .catch((err) => {
                console.error('Twitter: there has been an error while pruning');
                console.dir(err);
            })
    }

    /**
     * Tweets a status
     * @public
     * @param {String} status
     * @returns {Promise}
     */
    tweet(status) {
        if(typeof status !== 'string') {
            throw new Error('Twitter: status is not a String, cannot tweet');
        } else if(status.length > 140) {
            throw new Error('Twitter: status too long');
        }
        return this.twit.post('statuses/update', { status: status });
    }

    /**
     * Starts the twitterbot
     * @public
     */
    start() {
        this.isStarted = true;
        this.mingleInterval = setInterval(this.mingle, this.config.mingleInterval);
        this.pruneInterval = setInterval(this.prune, this.config.pruneInterval);
    }

    /**
     * Stops the twitterbot
     * @public
     */
    stop() {
        if (!this.isStarted) {
            console.error('Cannot stop TwitterService because it has not been started');
            return;
        }
        clearInterval(this.mingleInterval);
        clearInterval(this.pruneInterval);
        this.unsubscribeObservables();
        this.isStarted = false;
    }

    /**
     * @private
     */
    unsubscribeObservables() {
        this.subscriptions.map((disposable) => {disposable.unsubscribe()});
    }

    /**
     * Returns a random item from the given Array
     * @param {Array} arr
     * @returns {*}
     */
    randIndex(arr) {
        let index = Math.floor(arr.length * Math.random());
        return arr[index];
    };

    get twit() {
        return this._twit;
    }

    get config() {
        return this._config;
    }

    get subscriptions() {
        return this._subscriptions;
    }
}

module.exports = Twitter;