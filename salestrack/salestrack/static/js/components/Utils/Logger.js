const debugMessages = false;

export class Logger {
    constructor(creatorClass = '') {
        this.creator = creatorClass;
    }

    setDebug = (debug) => {
        debugMessages = debug;
    }

    log = (message, callerFunction = '') => {
        if (debugMessages) {
            const prefix = this.creator ? `${this.creator} |` : '';
            console.log(`${prefix}${callerFunction ? callerFunction + ' : ': ''} ${message}`);
        }
    }
}
