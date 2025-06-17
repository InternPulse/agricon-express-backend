import express, { NextFunction, Request, Response } from 'express';
import bookingRoutes from './routes/booking.routes';
import facilityRoutes from './routes/facility.routes';
import { BaseError, IErrorResponse } from './errors/errors';

const app = express();

const BASE_URL = '/api/v1';
// Middleware
app.use(express.json());
app.use(`${BASE_URL}/bookings`, bookingRoutes)
app.use(`${BASE_URL}/facilities`, facilityRoutes)

app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
  if (error instanceof BaseError) {
    res.status(error.statusCode).json(error.toJSON);
  }
  next();
});

export default app;