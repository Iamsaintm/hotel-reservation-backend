const express = require("express");

const router = express.Router();
const authenticateMiddleware = require("../../middlewares/authenticateAdmin");
const userController = require("../../controllers/admin/user-controllers");

router.get("/", authenticateMiddleware, userController.getUser);

module.exports = router;
