module.exports = {
    speedTest: {
        url: 'http://fast.com',
        resultSelector: '#speed-value'
    },
    teleColumbus: {
        interval: 1000*60*15,
        tweetInterval: 1000*60*60*2,
        speedPaidFor: 120,
        tweetThreshold: 50
    },
    twitterBot: {
        actionInterval: 1000*60*20,
        pruneToMingleRatio: 0.2
    }
};