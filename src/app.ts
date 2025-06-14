import dotenv from 'dotenv';
import express from 'express';
import bookingRouter from './routes/booking.routes';


dotenv.config();

const app = express();

// Middleware
app.use(express.json());

app.use('/booking', bookingRouter)



export default app;