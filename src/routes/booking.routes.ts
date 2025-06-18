import express from 'express';
import { fetchBookings, updateBooking } from '../controllers/booking.controller';
import { verifyAuth } from '../middlewares/authenticate.middleware';

const router = express.Router();

router.get('/', verifyAuth, fetchBookings);
router.put('/:bookingId', verifyAuth, updateBooking);





export default router;
