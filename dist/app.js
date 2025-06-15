import express from 'express';
import bookingRoutes from './routes/booking.routes';
import facilityRoutes from './routes/facility.routes';
import { BaseError } from './errors/errors';
import { verifyAuth } from './middlewares/authenticate.middleware';
import { healthCheck, test_db } from './test_database.ts/test_db';
const app = express();
const BASE_URL = '/api/v1';
// Middleware
app.use(express.json());
app.use(`${BASE_URL}/bookings`, verifyAuth, bookingRoutes);
app.use(`${BASE_URL}/facilities`, verifyAuth, facilityRoutes);
//endpoints to test db connection
app.post(`${BASE_URL}/init-db`, test_db);
app.get(`${BASE_URL}/health`, healthCheck);
app.use((error, _req, res, next) => {
    if (error instanceof BaseError) {
        res.status(error.statusCode).json(error.toJSON);
    }
    next();
});
export default app;
