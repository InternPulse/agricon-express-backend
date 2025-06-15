import { StatusCodes } from "http-status-codes";
;
export class BaseError extends Error {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    from = "Server";
    constructor(message) {
        super(message);
    }
    toJSON() {
        return {
            message: this.message,
            statusCode: this.statusCode,
            from: this.from,
        };
    }
}
export class BadRequestError extends BaseError {
    constructor({ message, from }) {
        super(message);
        this.statusCode = StatusCodes.BAD_REQUEST;
        this.from = from;
    }
}
export class NotFoundError extends BaseError {
    constructor({ message, from }) {
        super(message);
        this.statusCode = StatusCodes.NOT_FOUND;
        this.from = from;
    }
}
export class UnauthorizedError extends BaseError {
    constructor({ message, from }) {
        super(message);
        this.statusCode = StatusCodes.UNAUTHORIZED;
        this.from = from;
    }
}
