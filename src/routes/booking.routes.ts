import { Router } from "express";
import {
  createBookingHandler,
  deleteBookingHandler,
  fetchBooking,
  listFarmerBookings,
  updateBookingHandler,
  listBookings,
  expireBooking,
} from "../controllers/booking.controller";

import { validateBookingId } from "../middlewares/bookingValidation";
import {
  authorizeRole,
  checkBookingOwnership,
  isFarmer,
} from "../middlewares/authorization.middlewares";
import { verifyAuth } from "../middlewares/authenticate.middleware";
import { UserRole } from "../types/types";

const router = Router();

/**
 * Booking Routes
 * ==============
 * These routes cover:
 * - Public farmer booking endpoints
 * - Admin/operator tools (list/expire bookings)
 */

//  Protected: Admin or Operator — List all bookings
router.get(
  "/bookings",
  verifyAuth,
  authorizeRole(UserRole.OPERATOR, UserRole.ADMIN),
  listBookings
);

//  Protected: Admin or Operator — Expire a booking
router.patch(
  "/bookings/:bookingId/expire",
  verifyAuth,
  authorizeRole(UserRole.OPERATOR, UserRole.ADMIN),
  validateBookingId,
  expireBooking
);

//  Farmer or Operator — Create a new booking
router.post(
  "/",
  verifyAuth,
  authorizeRole(UserRole.FARMER, UserRole.OPERATOR),
  createBookingHandler
);

//  Authenticated farmer — List their bookings
router.get("/farmer", verifyAuth, isFarmer, listFarmerBookings);

//  Get specific booking by ID
router.get("/:bookingId", verifyAuth, validateBookingId, fetchBooking);

//  Update a booking
router.patch(
  "/:bookingId",
  verifyAuth,
  validateBookingId,
  updateBookingHandler
);

//  Delete a booking (with ownership check)
router.delete(
  "/:bookingId",
  verifyAuth,
  validateBookingId,
  checkBookingOwnership,
  deleteBookingHandler
);

export default router;
