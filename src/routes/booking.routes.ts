import express from 'express';
import {deleteBookingHandler, fetchBooking, listFarmerBookings } from '../controllers/booking.controller';
import { validateBookingId } from '../middlewares/bookingValidation';
import { isFarmer } from '../middlewares/authorization.middlewares';
import { verifyAuth } from '../middlewares/authenticate.middleware';
import { updateBookingHandler } from '../controllers/updatebooking.controller';
import { createBookingHandler, deleteBookingHandler, fetchBooking, listFarmerBookings } from '../controllers/booking.controller';

const router = express.Router();

router.delete('/:bookingId', validateBookingId, checkBookingOwnership, deleteBookingHandler);
router.post('/create-booking', verifyAuth, authorizeRole([UserRole.FARMER, UserRole.OPERATOR]), createBookingHandler)
router.patch('/:bookingId', verifyAuth, validateBookingId,  updateBookingHandler);
router.get('/:bookingId', verifyAuth, validateBookingId, fetchBooking)
router.delete('/:bookingId', verifyAuth, validateBookingId, deleteBookingHandler)

router.get('/', listFarmerBookings);

export default router;
