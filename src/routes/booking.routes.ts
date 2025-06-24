import express from 'express';
import { validateBookingId } from '../middlewares/bookingValidation';
import { isFacilityOwner, isFarmer } from '../middlewares/authorization.middlewares';
import { verifyAuth } from '../middlewares/authenticate.middleware';
import { updateBookingHandler } from '../controllers/updatebooking.controller';
import { createBookingHandler, deleteBookingHandler, expireBooking, fetchBooking, listFacilityBookings, listFarmerBookings, approveOrRejectBookingHandler } from '../controllers/booking.controller';

const router = express.Router();
router.get('/farmer/me', verifyAuth, isFarmer, listFarmerBookings);
router.get('/operator/me', verifyAuth, isFacilityOwner, listFacilityBookings);
router.post('/', verifyAuth, isFarmer, createBookingHandler)
router.get('/:bookingId', verifyAuth, validateBookingId, fetchBooking)
router.patch('/:bookingId', verifyAuth, validateBookingId,  updateBookingHandler);
router.delete('/:bookingId', validateBookingId, deleteBookingHandler);
router.patch('/:bookingId/expire', verifyAuth, validateBookingId, expireBooking);
router.patch('/:bookingId/approval', verifyAuth, isFacilityOwner, validateBookingId, approveOrRejectBookingHandler);


export default router;
