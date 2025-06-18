
import express from 'express';
import { deleteBooking, listFarmerBookings } from '../controllers/booking.controller';
import { validateBookingId } from '../middlewares/bookingValidation';
import { authorizeRole, checkBookingOwnership } from '../middlewares/authorization.middlewares';
import { UserRole } from '../types/types';
import { createBookingHandler } from '../controllers/createbooking.controller';
import { verifyAuth } from '../middlewares/authenticate.middleware';

const router = express.Router();

// router.post('/', createBooking);

// DELETE /api/bookings/:bookingId - Delete a specific booking
router.delete('/:bookingId', validateBookingId, checkBookingOwnership, deleteBooking);
router.post('/create-booking', verifyAuth, authorizeRole([UserRole.FARMER, UserRole.OPERATOR]), createBookingHandler)

router.get('/', listFarmerBookings);

export default router;
