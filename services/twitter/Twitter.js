class Twitter {

    /**
     * @param {Twit} twit
     */
    constructor(twit) {
        this._twit = twit;
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
                return reply.data.ids;
            })
            // then select a random follower and get his followers
            .then(followers => {
                let randomFollower = this.randIndex(followers);
                return this.twit.get('friends/ids', { user_id: randomFollower });
            })
            // then follow a random friend of that follower
            .then(reply => {
                let friendsFollowers = reply.data.ids;
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
     * @public
     * @returns {Promise}
     */
    prune() {
        let followers = null;
        // first get all followers
        return this.twit.get('followers/ids')
            .then((reply) => {
                followers = reply.data.ids;
            })
            // then get current Friends
            .then(() => this.twit.get('friends/ids'))
            // then find a friend that is not a follower
            .then((reply) => this.findPruneTarget(reply.data.ids, followers))
            // then unfollow that friend
            .then(pruneTarget => pruneTarget ? this.twit.post('friendships/destroy', { id: pruneTarget }) : null)
            .catch((err) => {
                this.log.error('Twitter: there has been an error while pruning');
                this.log.error(err);
            })
    }

    /**
     * @private
     * @param {Number[]} friends
     * @param {Number[]} followers
     * @return {Number|null}
     */
    findPruneTarget(friends, followers) {
        let pruneTarget = null;
        let triesLeft = 20;

        while (!pruneTarget && triesLeft) {
            let target = this.randIndex(friends);

            if (followers.indexOf(target) < 0) {
                pruneTarget = target;
            }
            triesLeft--;
        }
        return pruneTarget;
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
}

module.exports = Twitter;