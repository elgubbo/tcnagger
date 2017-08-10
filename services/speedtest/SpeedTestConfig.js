class SpeedTestConfig {

    /**
     * @param {Object} config
     * @param {String} config.url - the speedtest site url
     * @param {String} config.resultSelector - the jquery selector that is used to find the result
     * @param {Function} config.transformFn - the function applied to the result
     * of the selector to transform it to Mbit/S as a Number
     * @param {String} config.buttonSelector - the button that needs to be clicked to start the speedtest
     * @param {String} config.isDoneSelector - the selector that should return a result when the test is done
     * @param {String} config.customPageHeaders - the custom headers to apply to page requests
     */
    constructor(config) {
        config = config || {};
        this._url = config.url || null;
        this._resultSelector = config.resultSelector || null;
        this._buttonSelector = config.buttonSelector || null;
        this._transformFn = config.transformFn || null;
        this._isDoneSelector = config.isDoneSelector || null;
        this._customPageHeaders = config.customPageHeaders || null;
    }

    get customPageHeaders() {
        return this._customPageHeaders;
    }

    get isDoneSelector() {
        return this._isDoneSelector;
    }

    get transformFn() {
        return this._transformFn;
    }

    get buttonSelector() {
        return this._buttonSelector;
    }

    get resultSelector() {
        return this._resultSelector;
    }

    get url() {
        return this._url;
    }

    set isDoneSelector(value) {}

    set transformFn(value) {}

    set buttonSelector(value) {}

    set resultSelector(value) {}

    set url(value) {}

    set customPageHeaders(value) {}
}

module.exports = SpeedTestConfig;