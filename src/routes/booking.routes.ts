import { Router } from "express";
import {
  deleteBooking,
  listFarmerBookings,
  fetchBooking,
  updateBookingHandler,
} from "../controllers/booking.controller";

import { listBookings } from "../controllers/ListBookings.controller";
import { expireBooking } from "../controllers/expireBookings.controller";

import { validateBookingId } from "../middlewares/bookingValidation";
import {
  checkBookingOwnership,
  authorizeRole,
} from "../middlewares/authorization.middlewares";
import { verifyAuth } from "../middlewares/authenticate.middleware";

import { createBookingHandler } from "../controllers/createBooking.controller";
import { UserRole } from "../types/types";

const router = Router();

// List all bookings (admin + operator access only)
router.get(
  "/bookings",
  verifyAuth,
  authorizeRole(UserRole.OPERATOR, UserRole.ADMIN),
  listBookings
);

// Expire Booking
router.patch(
  "/bookings/:bookingId/expire",
  verifyAuth,
  authorizeRole([UserRole.ADMIN, UserRole.OPERATOR]),
  expireBooking
);

// List bookings for a logged-in farmer
router.get("/", listFarmerBookings);

// Create a new booking (farmer + operator only)
router.post(
  "/create-booking",
  verifyAuth,
  authorizeRole(UserRole.FARMER, UserRole.OPERATOR),
  createBookingHandler
);

// Fetch a specific booking
router.get("/:bookingId", verifyAuth, validateBookingId, fetchBooking);

// Update a booking
router.put("/:bookingId", verifyAuth, validateBookingId, updateBookingHandler);

// Delete a booking
router.delete(
  "/:bookingId",
  verifyAuth,
  validateBookingId,
  checkBookingOwnership,
  deleteBooking
);

export default router;
