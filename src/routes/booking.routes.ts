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
import { createBookingHandler } from '../controllers/booking.controller';
import { authorizeRole } from '../middlewares/authorization.middlewares';
import { UserRole } from '../types/types';

const router = express.Router();

router.post('/create-booking', authorizeRole([UserRole.FARMER]),  createBookingHandler );


export default router;