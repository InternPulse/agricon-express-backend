import express from 'express';
import { createBooking, deleteBooking } from '../controllers/booking.controller';

const router = express.Router();

router.post('/create-booking', createBooking);
router.delete('/:bookingId', deleteBooking);

export default router;
