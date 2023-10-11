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
  "/:userId/:roomId",
  authenticateMiddleware,
  bookingController.updateBooking
);

router.delete(
  "/:userId/:roomId",
  authenticateMiddleware,
  bookingController.deleteBooking
);

router.patch(
  "/payment/:userId/:roomId",
  authenticateMiddleware,
  bookingController.acceptRequest
);

router.patch(
  "/payment/:userId/:roomId/reject",
  authenticateMiddleware,
  bookingController.rejectRequest
);
module.exports = router;
