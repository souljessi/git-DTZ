export class RuntimeException {

    constructor(message) {
        this._message = message;
    }

    get name() {
        return 'RuntimeException';
    }

    get message() {
        return this._message;
    }

    toString() {
        return this.name + ': ' + this.message;
    }

}

export class IllegalStateException extends RuntimeException {

    constructor(message) {
        super(message);
    }

    get name() {
        return 'IllegalStateException';
    }

}

export class InvalidArgumentException extends RuntimeException {

    constructor(message) {
        super(message);
    }

    get name() {
        return 'InvalidArgumentException';
    }

}

export class NotImplementedException extends RuntimeException {

    constructor(message) {
        super(message);
    }

    get name() {
        return 'NotImplementedException';
    }

}

export class ExceptionService {
    static handleError(error) {
        think.logger.error(error);
        return {
            success: false,
            error: error.name || 'Error',
            msg: error.message || error,
            errno: 1000
        }
    }
}



