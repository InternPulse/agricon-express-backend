import { StatusCodes } from "http-status-codes";

interface IError {
  message: string,
  statusCode?: string,
  from: string
};

export interface IErrorResponse {
  message: string;
  statusCode: number;
  from: string;
  toJSON(): IError;
}

export class BaseError extends Error {
  statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  from = "Server";

  constructor(message: string) {
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
  constructor({message, from}: IError) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
    this.from = from;
  }
}

export class NotFoundError extends BaseError {
  constructor({message, from}: IError) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
    this.from = from;
  }
}

export class UnauthorizedError extends BaseError {
  constructor({message, from}: IError) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
    this.from = from;
  }
}