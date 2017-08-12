const expect = require('chai').expect;

describe('The TwitterBot', function () {

    it('should start', function () {
        let twitterBot = this.services.twitterBot;
        twitterBot.start();
        let observable = twitterBot.observable;
        expect(observable).to.not.be.null;
        expect(observable.subscribe).to.be.an.instanceOf(Function)
    });

    it('should stop', function () {
        let twitterBot = this.services.twitterBot;
        twitterBot.start();
        twitterBot.stop();
        expect(twitterBot.isRunning).to.be.false;
    });

    it('should throw when stopped before started', function () {
        let twitterBot = this.services.twitterBot;
        expect(twitterBot.stop).to.throw();
    });

    it('should return a promise on twitterAction', function () {
        let twitterBot = this.services.twitterBot;
        let promise = twitterBot.twitterAction();
        expect(promise.then).to.be.an.instanceOf(Function);
        expect(promise.catch).to.be.an.instanceOf(Function);
    })

});
