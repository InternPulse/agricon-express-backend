import express from 'express';
import { deleteBooking, listFarmerBookings } from '../controllers/booking.controller';
import { validateBookingId } from '../middlewares/bookingValidation';
import { authorizeRole } from '../middlewares/authorization.middlewares';
import { createBookingHandler } from '../controllers/createbooking.controller';
import { verifyAuth } from '../middlewares/authenticate.middleware';
import { updateBookingHandler } from '../controllers/updatebooking.controller';

const router = express.Router();

router.delete('/:bookingId', validateBookingId, deleteBooking);
router.post('/create-booking', verifyAuth, authorizeRole, createBookingHandler)
router.patch('/:bookingId', verifyAuth, validateBookingId,  updateBookingHandler);
//router.get('/:bookingId', verifyAuth, validateBookingId, fetchBooking)

router.get('/', listFarmerBookings);

export default router;
