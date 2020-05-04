
export class Logger {
    constructor(creatorClass = '') {
        this.debug = true;
        this.creator = creatorClass;
    }

    setDebug = (debug) => {
        this.debug = debug;
    }

    log = (message, callerFunction = '') => {
        if (this.debug) {
            const prefix = this.creator ? `${this.creator} |` : '';
            console.log(`${prefix}${callerFunction ? callerFunction + ' : ': ''} ${message}`);
        }
    }
}
