import express from 'express';
import { deleteBooking, listFarmerBookings } from '../controllers/booking.controller';
import { validateBookingId } from '../middlewares/bookingValidation';
import { checkBookingOwnership } from '../middlewares/authorization.middlewares';
// import { createBooking, } from '../controllers/booking.controller';

const router = express.Router();

// router.post('/', createBooking);

// DELETE /api/bookings/:bookingId - Delete a specific booking
router.delete('/:bookingId', validateBookingId, checkBookingOwnership, deleteBooking);

router.get('/', listFarmerBookings);

export default router;
