const express = require("express");

const router = express.Router();
const authenticateMiddleware = require("../../middlewares/authenticate");
const userController = require("../../controllers/user/user-controller");

// router.get("/",authenticateMiddleware, userController.register);

// router.get("/room",authenticateMiddleware, userController.allRoomBooking);
// router.post("/", authenticateMiddleware, userController.bookingRoom);
// router.delete("/:roomId", authenticateMiddleware, userController.cancelBooking);

module.exports = router;
