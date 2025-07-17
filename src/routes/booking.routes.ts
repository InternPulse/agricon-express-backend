import express from 'express';
import { validateBookingId } from '../middlewares/bookingValidation';
import { isFacilityOwner, isFarmer, isAuthorizedFarmer, isAuthorizedOperator } from '../middlewares/authorization.middlewares';
import { verifyAuth } from '../middlewares/authenticate.middleware';
import { 
    deleteBookingHandler, expireBooking, fetchBooking, listAllFacilitiesBookings, listFarmerBookings, 
    approveOrRejectBookingHandler, updateBookingHandler, createBookingHandler, getTotalApprovedBookings } 
    from '../controllers/booking.controller';

import { preventDateUpdateIfPaid } from '../middlewares/bookingDateValidator';


const router = express.Router();

router.post('/', verifyAuth, createBookingHandler);
router.get('/farmer/me', verifyAuth, isAuthorizedFarmer, listFarmerBookings);
router.get('/operator/me', verifyAuth, isAuthorizedOperator, listAllFacilitiesBookings);

router.get('/operator/approved-bookings',verifyAuth, isAuthorizedOperator, getTotalApprovedBookings);

router.get('/:bookingId', verifyAuth, validateBookingId,  fetchBooking);
router.patch('/:bookingId', verifyAuth, isAuthorizedFarmer, validateBookingId, preventDateUpdateIfPaid, updateBookingHandler);
router.delete('/:bookingId', verifyAuth, isAuthorizedFarmer, validateBookingId, deleteBookingHandler);
router.patch('/:bookingId/expire', verifyAuth, validateBookingId, expireBooking);
router.patch('/:bookingId/approval', verifyAuth, isAuthorizedOperator, isFacilityOwner, validateBookingId, approveOrRejectBookingHandler);


export default router; 