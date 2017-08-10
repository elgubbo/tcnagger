'use strict';
const phantom = require('phantomjs-prebuilt');
const driver = require('promise-phantom');
const co = require('co');
const wait = require('co-wait');

class SpeedTest {

    /**
     * @param {SpeedTestConfig} config
     * @param {String} config.url - the speedtest site url
     * @param {String} config.resultSelector - the jquery selector that is used to find the result
     * @param {Function} config.transformFn - the function applied to the result
     * of the selector to transform it to Mbit/S as a Number
     * @param {String} config.buttonSelector - the button that needs to be clicked to start the speedtest
     * @param {String} config.isDoneSelector - the selector that should return a result when the test is done
     * @param {String} config.customPageHeaders - the custom headers to apply to page requests
     */
    constructor(config) {
        this.url = config.url;
        this.resultSelector = config.resultSelector;
        this.buttonSelector = config.buttonSelector || null; // TODO
        this.transformFn = config.transformFn || function (value) {
            return value; //TODO
        };
        this.isDoneSelector = config.isDoneSelector; // TODO
        this.customPageHeaders = config.customPageHeaders || {};
    }

    /**
     * @public
     */
    doSpeedTest() {
        return this.evaluatePage();
    }

    /**
     * @public
     */
    evaluatePage() {
        let evaluate = this.createPageEvaluatorFunction();
        return evaluate(this.url, this.resultSelector, this.transformFn, this.buttonSelector);
    }


    /**
     * @private
     * @returns {Function}
     */
    createPageEvaluatorFunction() {
        return co.wrap(function* (url, resultSelector, transformFn, buttonSelector) {
            const browser = yield driver.create({path: phantom.path});
            const page = yield browser.createPage();
            page.customHeaders = this.customPageHeaders;
            const status = yield page.open(url);
            let previousSpeed = '0';
            let speed = '0';
            let result = {
                url,
            };

            if (status !== 'success') {
                result['speed'] = 0;
                result['error'] = status;
                return result;
            }

            yield page.includeJs('http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js');
            yield wait(10000);

            if (buttonSelector !== null) {
                yield page.evaluate(function(buttonSelector) {
                    $(buttonSelector).trigger('click')
                }, buttonSelector);
                yield wait(2000);
            }


            do {
                previousSpeed = speed;
                // we wait for the speed to change
                yield wait(1000);

                speed = yield page.evaluate(function (selector) {
                    return $(selector).first().html();
                }, resultSelector);

                if (transformFn) {
                    speed = transformFn.call(this, speed);
                }

            } while (((speed === null) && speed !== '') || speed !== previousSpeed);
            result['speed'] = speed;
            browser.exit();
            return result;
        })
    }

}

module.exports = SpeedTest;
