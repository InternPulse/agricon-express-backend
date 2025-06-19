import express from 'express';
import { validateBookingId } from '../middlewares/bookingValidation';
import { isFarmer } from '../middlewares/authorization.middlewares';
import { verifyAuth } from '../middlewares/authenticate.middleware';
import { updateBookingHandler } from '../controllers/updatebooking.controller';
import { createBookingHandler, deleteBookingHandler, fetchBooking, listFarmerBookings } from '../controllers/booking.controller';

const router = express.Router();

router.post('/', verifyAuth, isFarmer, createBookingHandler)
router.get('/farmer', listFarmerBookings);
router.get('/:bookingId', verifyAuth, validateBookingId, fetchBooking)
router.patch('/:bookingId', verifyAuth, validateBookingId,  updateBookingHandler);
router.delete('/:bookingId', validateBookingId, deleteBookingHandler);

export default router;
