const Log = require('./../helpers/Log');

class BaseService {

    constructor(log) {
        this._log = log;
    }

    /**
     * @public
     * @return {Observable}
     */
    start() {
        this._isRunning = true;
        return this._observable;
    }

    /**
     * @public
     */
    stop() {
        if (!this._isRunning) {
            this.log.error('Cannot stop Service. It has not been started');
        }
        if (this._observer) {
            this._observer.complete();
        }
        clearInterval(this._timerInterval);
        this._isRunning = false;
    }

    /**
     * @return {Observable}
     */
    get observable() {
        if (!this._isRunning) {
            this.start();
        }
        return this._observable;
    }

    get log() {
        if (!this._log) {
            this._log = new Log(false);
        }
        return this._log;
    }

    set log(log) {
        this._log = log;
    }

    get isRunning() {
        return this._isRunning;
    }
}

module.exports = BaseService;