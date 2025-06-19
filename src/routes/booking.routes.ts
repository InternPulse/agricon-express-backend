import { Router } from "express";
import {
  deleteBooking,
  listFarmerBookings,
  listBookings,
} from "../controllers/booking.controller";
import { validateBookingId } from "../middlewares/bookingValidation";
import { checkBookingOwnership } from "../middlewares/authorization.middleware";
import { verifyAuth } from "../middlewares/authenticate.middleware";
import { authorizeRole } from "../middlewares/authorization.middlewares";
import { UserRole } from "../types/types";

const router = Router();

router.delete(
  "/:bookingId",
  validateBookingId,
  checkBookingOwnership,
  deleteBooking
);
router.get("/", listFarmerBookings);

router.get(
  "/bookings",
  verifyAuth,
  authorizeRole([UserRole.OPERATOR, UserRole.ADMIN]),
  listBookings
);

export default router;
