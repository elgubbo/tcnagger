const expect = require('chai').expect;

describe('The TeleColumbus', function () {

    it('should start', function () {
        let teleColumbus = this.services.teleColumbus;
        teleColumbus.start();
        let observable = teleColumbus.observable;
        expect(observable).to.not.be.null;
        expect(observable.subscribe).to.be.an.instanceOf(Function)
    });

    it('should stop', function () {
        let teleColumbus = this.services.teleColumbus;
        teleColumbus.start();
        teleColumbus.stop();
        expect(teleColumbus.isRunning).to.be.false;
    });

    it('should throw when stopped before started', function () {
        let teleColumbus = this.services.teleColumbus;
        expect(teleColumbus.stop).to.throw();
    });

});
