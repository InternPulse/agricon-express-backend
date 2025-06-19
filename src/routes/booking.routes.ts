import { Router } from "express";
import { listBookings } from "../controllers/booking.controller";
import { verifyAuth } from "../middlewares/authenticate.middleware";

const router = Router();

router.get("/bookings", verifyAuth, listBookings);

export default router;
