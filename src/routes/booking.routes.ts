import express from 'express';
import {deleteBookingHandler, fetchBooking, listFarmerBookings } from '../controllers/booking.controller';
import { validateBookingId } from '../middlewares/bookingValidation';
import { authorizeRole, checkBookingOwnership } from '../middlewares/authorization.middlewares';
import { UserRole } from '../types/types';
import { createBookingHandler } from '../controllers/createbooking.controller';
import { verifyAuth } from '../middlewares/authenticate.middleware';
import { updateBookingHandler } from '../controllers/updatebooking.controller';

const router = express.Router();

router.delete('/:bookingId', validateBookingId, checkBookingOwnership, deleteBookingHandler);
router.post('/create-booking', verifyAuth, authorizeRole([UserRole.FARMER, UserRole.OPERATOR]), createBookingHandler)
router.patch('/:bookingId', verifyAuth, validateBookingId,  updateBookingHandler);
router.get('/:bookingId', verifyAuth, validateBookingId, fetchBooking)
router.delete('/:bookingId', verifyAuth, validateBookingId, deleteBookingHandler)

router.get('/', listFarmerBookings);

export default router;
