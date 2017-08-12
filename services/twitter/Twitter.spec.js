const expect = require('chai').expect;

describe('The Twitter', function () {
    it('should find a prune target', function () {
        let target = this.services.twitter.findPruneTarget([1], [1]);
        expect(target).to.be.null;
        target = this.services.twitter.findPruneTarget([1, 2, 3], [2, 3, 4]);
        expect(target).to.eql(1);
    });

    it('should be able to tweet', function () {
        let promise = this.services.twitter.tweet('bla');
        expect(promise.then).to.be.an.instanceOf(Function);
        expect(promise.catch).to.be.an.instanceOf(Function);
    });

    it('should be throw when tweet is to long to tweet', function () {
        let longString = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor' +
            ' invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At v';
        let tweetFn = this.services.twitter.tweet;
        expect(() => tweetFn(longString)).to.throw();
    });

    it('should be throw when tweet is called without string', function () {
        let longString = null;
        let tweetFn = this.services.twitter.tweet;
        expect(() => tweetFn(longString)).to.throw();
    });

    it('should return a promise when mingling', function () {
        expect(this.services.twitter.mingle().then).to.be.an.instanceOf(Function);
    });

    it('should return a promise when pruning', function () {
        expect(this.services.twitter.prune().then).to.be.an.instanceOf(Function);
    });

});
