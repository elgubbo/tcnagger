const sinon = require('sinon');
require('chai');
const config = require('app-config');
const ServiceFactory = require('./services/ServiceFactory');

beforeEach(function () {
    this.sandbox = sinon.sandbox.create();
    this.config = config;
    this.services = new ServiceFactory(Object.assign({}, this.config.twitter, this.config.services));
});

afterEach(function () {
    this.sandbox.restore();
});