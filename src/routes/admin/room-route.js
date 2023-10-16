const express = require("express");

const router = express.Router();
const authenticateMiddleware = require("../../middlewares/authenticateAdmin");
const roomController = require("../../controllers/admin/room-controller");
const uploadMiddleware = require("../../middlewares/upload");

router.get("/", authenticateMiddleware, roomController.getRoom);
router.post("/", authenticateMiddleware, roomController.addRoom);
router.post(
  "/roomType",
  authenticateMiddleware,
  uploadMiddleware.single("roomImage"),
  roomController.addRoomType
);
router.patch("/:roomId", authenticateMiddleware, roomController.updateRoom);
router.patch(
  "/:roomTypeId/roomType",
  authenticateMiddleware,
  roomController.updateRoomType
);
router.delete("/:roomId", authenticateMiddleware, roomController.deleteRoom);
router.delete(
  "/:roomTypeId/roomType",
  authenticateMiddleware,
  roomController.deleteRoomType
);
module.exports = router;
