import cron from 'node-cron';
import { expireReservation } from '../services/db/booking.service';
import { BadRequestError } from '../errors/errors';

// 10 minutes check
cron.schedule('*/10 * * * *', async () => {
  console.log('Running auto-expire check...');
  try {
    await expireReservation();
  } catch (error) {
    throw new BadRequestError({
      message: 'Cron Job failed',
      from: 'Cron Booking Expiration',
      cause: error
    });
  }
});
