const express = require("express");

const router = express.Router();
const userController = require("../../controllers/user/room-controller");

router.get("/", userController.getRoom);

module.exports = router;
