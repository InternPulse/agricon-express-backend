import { StatusCodes } from "http-status-codes";

export interface IError {
  message: string;
  statusCode?: number;
  from: string;
  cause?: any;
}

export interface IErrorResponse {
  message: string;
  statusCode: number;
  from: string;
  cause?: any;
}

export class BaseError extends Error {
  statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  from = "Server";
  cause?: any;

  constructor({ message, statusCode, from, cause }: IError) {
    super(message);
    this.name = this.constructor.name;
    if (statusCode) {
      this.statusCode = statusCode;
    }
    this.from = from || this.from;
    this.cause = cause;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON(): IErrorResponse {
    return {
      message: this.message,
      statusCode: this.statusCode,
      from: this.from,
      cause: this.cause
    };
  }
}


export class BadRequestError extends BaseError {
  constructor(props: IError) {
    super({ ...props, statusCode: StatusCodes.BAD_REQUEST });
  }
}

export class NotFoundError extends BaseError {
  constructor(props: IError) {
    super({ ...props, statusCode: StatusCodes.NOT_FOUND });
  }
}

export class UnauthorizedError extends BaseError {
  constructor(props: IError) {
    super({ ...props, statusCode: StatusCodes.UNAUTHORIZED });
  }
}

export class ForbiddenError extends BaseError {
  constructor(props: IError) {
    super({ ...props, statusCode: StatusCodes.FORBIDDEN });
  }
}

export class ConflictError extends BaseError {
  constructor(props: IError) {
    super({ ...props, statusCode: StatusCodes.CONFLICT });
  }
}

export class RequestTimeoutError extends BaseError {
  constructor(props: IError) {
    super({ ...props, statusCode: StatusCodes.REQUEST_TIMEOUT });
  }
}

export class MethodNotAllowedError extends BaseError {
  constructor(props: IError) {
    super({ ...props, statusCode: StatusCodes.METHOD_NOT_ALLOWED });
  }
}


export interface ValidationErrorDetail {
  field: string;
  message: string;
}

export class BookingValidationError extends Error {
  public readonly name = 'ValidationError';
  public readonly errors: ValidationErrorDetail[];

  constructor(message: string, errors: ValidationErrorDetail[]) {
    super(message);
    this.errors = errors;
    Object.setPrototypeOf(this, BookingValidationError.prototype);
  }
}
