import express from 'express';
import { deleteBooking, listFarmerBookings } from '../controllers/booking.controller';
// import { createBooking, } from '../controllers/booking.controller';

const router = express.Router();

// router.post('/create-booking', createBooking);
router.delete('/:bookingId', deleteBooking);
router.get('/farmer-bookings', listFarmerBookings);

export default router;
