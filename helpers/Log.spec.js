const expect = require('chai').expect;
const Log = require('./Log');
require('mocha-sinon');

describe('The Log', function () {

    beforeEach(function() {
        this.sinon.stub(console, 'log');
        this.sinon.stub(console, 'error');
        this.sinon.stub(console, 'warn');
        this.logWithDev = new Log(true);
        this.logWithoutDev = new Log(false);
    });

    it('should log dev when in devmode', function () {
        this.logWithDev.logDev('test');
        expect( console.log.calledOnce ).to.be.true;
        expect( console.log.calledWith('test') ).to.be.true;
    });

    it('should not log dev when not in devmode', function () {
        this.logWithoutDev.logDev('test');
        expect( console.log.callCount ).to.eql(0);
    });

    it('should log when in devmode', function () {
        this.logWithDev.log('test');
        expect( console.log.calledOnce ).to.be.true;
        expect( console.log.calledWith('test') ).to.be.true;
    });

    it('should log dev when not in devmode', function () {
        this.logWithoutDev.log('test');
        expect( console.log.calledOnce ).to.be.true;
        expect( console.log.calledWith('test') ).to.be.true;
    });



    it('should warn dev when in devmode', function () {
        this.logWithDev.warnDev('test');
        expect( console.warn.calledOnce ).to.be.true;
        expect( console.warn.calledWith('test') ).to.be.true;
    });

    it('should warn log dev when not in devmode', function () {
        this.logWithoutDev.warnDev('test');
        expect( console.warn.callCount ).to.eql(0);
    });

    it('should warn when in devmode', function () {
        this.logWithDev.warn('test');
        expect( console.warn.calledOnce ).to.be.true;
        expect( console.warn.calledWith('test') ).to.be.true;
    });

    it('should warn dev when not in devmode', function () {
        this.logWithoutDev.warn('test');
        expect( console.warn.calledOnce ).to.be.true;
        expect( console.warn.calledWith('test') ).to.be.true;
    });


    it('should error log when in devmode', function () {
        this.logWithDev.error('test');
        expect( console.error.calledOnce ).to.be.true;
        expect( console.error.calledWith('test') ).to.be.true;
    });

    it('should error log dev when not in devmode', function () {
        this.logWithoutDev.errorDev('test');
        expect( console.error.callCount ).to.eql(0);
    });

    it('should error log when in devmode', function () {
        this.logWithDev.error('test');
        expect( console.error.calledOnce ).to.be.true;
        expect( console.error.calledWith('test') ).to.be.true;
    });

    it('should error log when not in devmode', function () {
        this.logWithoutDev.error('test');
        expect( console.error.calledOnce ).to.be.true;
        expect( console.error.calledWith('test') ).to.be.true;
    });

});
