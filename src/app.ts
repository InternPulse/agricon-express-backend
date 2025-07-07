import express, { NextFunction, Request, Response } from 'express';
import bookingRoutes from './routes/booking.routes';
import facilityRoutes from './routes/facility.routes';
import notificationRoutes from './routes/notification.routes';
import { BaseError, IErrorResponse } from './errors/errors';
import { healthCheck, test_db } from './test_database.ts/test_db';
import {
  generalRateLimiter,
  bookingRateLimiter,
  facilityRateLimiter,
  healthCheckRateLimiter,
  databaseRateLimiter
} from './middlewares/rateLimit.middleware';
import { configCors } from './config/config.env';
import './cron/expireBookings'; 

const app = express();
app.use(configCors())
app.use(express.json());

(BigInt.prototype as any).toJSON = function () {
  return this.toString(); 
};

const BASE_URL = '/api/v1';
// Middleware

app.use(generalRateLimiter); // Apply general rate limiter globally
app.use(express.urlencoded({ extended: true }));
app.use(`${BASE_URL}/bookings`, bookingRateLimiter, bookingRoutes);
app.use(`${BASE_URL}/facilities`, facilityRateLimiter, facilityRoutes);
app.use(`${BASE_URL}/notifications`, notificationRoutes);

//endpoints to test db connection
app.post(`${BASE_URL}/init-db`, databaseRateLimiter, test_db); // DB rate limiter
app.get(`${BASE_URL}/health`, healthCheckRateLimiter, healthCheck); // Health check rate limiter

app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
  if (error instanceof BaseError) {
    res.status(error.statusCode).json(error.toJSON());
  }else if(error ){
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
      error: error.message || 'An unexpected error occurred'
    });
  }
  next();
});


export default app;