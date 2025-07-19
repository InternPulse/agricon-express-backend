import express from 'express';
import { validateBookingId } from '../middlewares/bookingValidation';
import { isFacilityOwner, isFarmer } from '../middlewares/authorization.middlewares';
import { verifyAuth } from '../middlewares/authenticate.middleware';
import { updateBookingHandler } from '../controllers/updatebooking.controller';
import { deleteBookingHandler, expireBooking, fetchBooking, listAllFacilitiesBookings, listFarmerBookings, approveOrRejectBookingHandler, createBookingHandler, getTotalApprovedBookings, getTodaysBookings } from '../controllers/booking.controller';
import { preventDateUpdateIfPaid } from '../middlewares/bookingDateValidator';


const router = express.Router();

router.post('/', verifyAuth, isFarmer, createBookingHandler);
router.get('/farmer/me', verifyAuth, isFarmer, listFarmerBookings);
router.get('/operator/me', verifyAuth, listAllFacilitiesBookings);
router.get('/operator/approved-bookings',verifyAuth,isFacilityOwner,getTotalApprovedBookings);
router.get('/operator/today-bookings', verifyAuth, getTodaysBookings);
router.get('/:bookingId', verifyAuth, validateBookingId, fetchBooking);
router.patch('/:bookingId', verifyAuth, validateBookingId, preventDateUpdateIfPaid, updateBookingHandler);
router.delete('/:bookingId', verifyAuth, validateBookingId, deleteBookingHandler);
router.patch('/:bookingId/expire', verifyAuth, validateBookingId, expireBooking);
router.patch('/:bookingId/approval', verifyAuth, isFacilityOwner, validateBookingId, approveOrRejectBookingHandler);


export default router; 