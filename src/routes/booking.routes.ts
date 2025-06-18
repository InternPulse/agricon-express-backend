// import express from 'express';
// import { CreateBookingController } from '../controllers/booking.controller';

// const router = express.Router();

// router.post('/create', async (req, res) => {
//     try {
//         const result = await CreateBookingController.createBooking(req.body);

//         if (result.success) {
//             res.status(201).json(result);
//         } else {
//             res.status(400).json(result);
//         }
//         } catch (error) {
//             res.status(500).json({
//                 success: false,
//                 message: 'Internal server error',
//             });
//         }
//     });

// export default router;


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
