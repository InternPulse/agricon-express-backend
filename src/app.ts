import express, { NextFunction, Request, Response } from 'express';
import bookingRoutes from './routes/booking.routes';
import facilityRoutes from './routes/facility.routes';
import notificationRoutes from './routes/notification.routes';
import { healthCheck, test_db } from './test_database.ts/test_db';
import {
  generalRateLimiter,
  bookingRateLimiter,
  facilityRateLimiter,
  healthCheckRateLimiter,
} from './middlewares/rateLimit.middleware';
import { configCors } from './config/config.env';
import './cron/expireBookings'; 
import { StatusCodes } from 'http-status-codes';
import { errorHandler } from './middlewares/errorHandler.middleware';
import { Result } from 'express-validator';

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

//endpoints to test connection
app.get(`${BASE_URL}/health`, healthCheckRateLimiter, healthCheck); // Health check rate limiter

app.use(errorHandler);

export default app;