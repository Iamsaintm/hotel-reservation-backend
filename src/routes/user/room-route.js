const express = require("express");

const router = express.Router();
const authenticateMiddleware = require("../../middlewares/authenticate");
const userController = require("../../controllers/user/room-controller");

router.get("/", authenticateMiddleware, userController.getRoom);

module.exports = router;
