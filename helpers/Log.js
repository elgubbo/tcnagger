class Log {
    // TODO: use a LogFactory to produce a proxy that in turn could reduce duplicate code in here

    /**
     * @param {Boolean} devMode
     */
    constructor(devMode) {
        this._devMode = devMode;
    }

    /**
     * @public
     * @param messages
     */
    logDev(...messages) {
        if (this.devMode) {
            this.log(...messages);
        }
    }

    /**
     * @public
     * @param messages
     */
    log(...messages) {
        if (messages) {
            messages = messages.map(this.transformMessage, this);
            console.log(...messages);
        }
    }

    /**
     * @public
     * @param messages
     */
    warnDev(...messages) {
        if (this.devMode) {
            this.warn(...messages);
        }
    }

    /**
     * @public
     * @param messages
     */
    warn(...messages) {
        messages = messages.map(this.transformMessage, this);
        console.warn(...messages);
    }

    /**
     * @public
     * @param messages
     */
    errorDev(...messages) {
        if (this.devMode) {
            this.warn(...messages);
        }
    }

    /**
     * @public
     * @param messages
     */
    error(...messages) {
        messages = messages.map(this.transformMessage, this);
        console.error(...messages);
    }

    /**
     * @private
     * @param message
     * @return {*}
     */
    transformMessage(message) {
        if (this.isFunction(message)) {
            return '' + message;
        }
        if (this.isObject(message)) {
            return JSON.stringify(message);
        }
        return message;
    }

    /**
     * @private
     * @param {*} obj
     * @returns {boolean}
     */
    isObject(obj) {
        return obj === Object(obj);
    }

    /**
     * @private
     * @param functionToCheck
     * @return {*|boolean}
     */
    isFunction(functionToCheck) {
        let getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    }

    get devMode() {
        return this._devMode;
    }

    set devMode(value) {
        this._devMode = value;
    }
}

module.exports = Log;