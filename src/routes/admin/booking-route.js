const express = require("express");

const router = express.Router();
const authenticateMiddleware = require("../../middlewares/authenticateAdmin");
const bookingController = require("../../controllers/admin/booking-controller");

router.get("/", authenticateMiddleware, bookingController.getBooking);

router.post(
  "/:userId",
  authenticateMiddleware,
  bookingController.createBooking
);

router.patch(
  "/:bookingId",
  authenticateMiddleware,
  bookingController.updateBooking
);

router.delete(
  "/:bookingId",
  authenticateMiddleware,
  bookingController.deleteBooking
);

router.patch(
  "/payment/:bookingId",
  authenticateMiddleware,
  bookingController.acceptRequest
);

router.patch(
  "/payment/:bookingId/reject",
  authenticateMiddleware,
  bookingController.rejectRequest
);
module.exports = router;
