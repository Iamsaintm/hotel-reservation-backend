const express = require("express");

const router = express.Router();
const authenticateMiddleware = require("../../middlewares/authenticate");
const userController = require("../../controllers/user/booking-controller");

router.get("/", authenticateMiddleware, userController.getBooking);

router.post("/", authenticateMiddleware, userController.createBooking);

router.patch(
  "/:bookingId",
  authenticateMiddleware,
  userController.updateBooking
);

router.delete(
  "/:bookingId",
  authenticateMiddleware,
  userController.deleteBooking
);

module.exports = router;
