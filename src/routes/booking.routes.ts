import express from 'express';
import { validateBookingId } from '../middlewares/bookingValidation';
import { isFarmer, isAuthorizedFarmer, isAuthorizedOperator, isOperator } from '../middlewares/authorization.middlewares';
import { verifyAuth } from '../middlewares/authenticate.middleware';
import { 
    deleteBookingHandler, expireBooking, fetchBookingById, listAllFacilitiesBookings, listFarmerBookings, 
    approveOrRejectBookingHandler, updateBookingHandler, createBookingHandler, getTotalApprovedBookings } 
    from '../controllers/booking.controller';

import { preventDateUpdateIfPaid } from '../middlewares/bookingDateValidator';


const router = express.Router();

router.post('/', verifyAuth, createBookingHandler);
router.get('/farmer/me', verifyAuth, isFarmer, isAuthorizedFarmer, listFarmerBookings);
router.get('/operator/me', verifyAuth, isOperator, isAuthorizedOperator, listAllFacilitiesBookings);
router.get('/approved-bookings',verifyAuth, isOperator, isAuthorizedOperator, getTotalApprovedBookings);

router.get('/:bookingId', verifyAuth, validateBookingId,  fetchBookingById);
router.patch('/:bookingId', verifyAuth, isFarmer, isAuthorizedFarmer, validateBookingId, preventDateUpdateIfPaid, updateBookingHandler);
router.delete('/:bookingId', verifyAuth, validateBookingId, deleteBookingHandler);
router.patch('/:bookingId/expire', verifyAuth, isOperator, validateBookingId, expireBooking);
router.patch('/:bookingId/approval', verifyAuth, isAuthorizedOperator, validateBookingId, approveOrRejectBookingHandler);


export default router;