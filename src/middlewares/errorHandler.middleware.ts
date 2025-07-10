import { StatusCodes } from "http-status-codes";
import { BaseError, IErrorResponse } from "../errors/errors";
import { Request, Response, NextFunction } from "express";

export const errorHandler = (error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
 if (error instanceof BaseError) {
    res.status(error.statusCode).json(error.toJSON());
  }else if(error ){
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message || 'An unexpected error occurred',
    });
  };
};