import express, { NextFunction, Request, Response } from 'express';
import bookingRoutes from './routes/booking.routes';
import facilityRoutes from './routes/facility.routes';
import { BaseError, IErrorResponse } from './errors/errors';
import { healthCheck, test_db } from './test_database.ts/test_db';

const app = express();
app.use(express.json());

(BigInt.prototype as any).toJSON = function () {
  return this.toString(); 
};

(BigInt.prototype as any).toJSON = function () {
  return this.toString();    
};

const BASE_URL = '/api/v1';
// Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(`${BASE_URL}/bookings`, bookingRoutes)
app.use(`${BASE_URL}/facilities`, facilityRoutes)

//endpoints to test db connection
app.post(`${BASE_URL}/init-db`, test_db)
app.get(`${BASE_URL}/health`, healthCheck);


app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
  if (error instanceof BaseError) {
    res.status(error.statusCode).json(error.toJSON());
  }
  next();
});

// app.all('*', (req: Request, res: Response) => {
//   res.status(StatusCodes.NOT_FOUND).json({
//     message: `Route ${req.originalUrl} not found`
//   });
// });

export default app;