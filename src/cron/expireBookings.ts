import cron from 'node-cron';
import { expireReservation } from '../services/booking.service';

// 10 minutes check
cron.schedule('*/10 * * * *', async () =>{
  console.log('Running auto-expire check...');
  try {
    await expireReservation();
  } catch (error) {
    console.error('Failed to expire reservations:', error);
  }
});
