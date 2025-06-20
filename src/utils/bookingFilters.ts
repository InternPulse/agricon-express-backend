import { MockBooking } from '../data/mockBookings';

export interface BookingFilterOptions {
  farmerId: string;
  status?: string;
  active?: string;
  limit?: number;
  offset?: number;
}

export const filterBookings = (
  bookings: MockBooking[], 
  options: BookingFilterOptions
): MockBooking[] => {
  const { farmerId, status, active, limit, offset = 0 } = options;

  // Filter bookings for the current farmer
  let filteredBookings = bookings.filter(booking => booking.farmerId === farmerId);

  // Filter by status if provided
  if (status && typeof status === 'string') {
    filteredBookings = filteredBookings.filter(booking => 
      booking.status.toLowerCase() === status.toLowerCase()
    );
  }

  // Filter by active status if provided
  if (active !== undefined) {
    const isActive = active === 'true';
    filteredBookings = filteredBookings.filter(booking => booking.active === isActive);
  }

  // Apply pagination if provided
  if (limit) {
    filteredBookings = filteredBookings.slice(offset, offset + limit);
  }

  return filteredBookings;
};