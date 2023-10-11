const prisma = require("../../models/prisma");
const createError = require("../../utils/create-error");

exports.getRoom = async (req, res, next) => {
  try {
    const room = await prisma.room.findMany();

    if (!room && room.length === 0) {
      return next(createError("Room does not exist", 404));
    }
    res.status(200).json(room);
  } catch (err) {
    next(err);
  }
};

exports.addRoom = async (req, res, next) => {
  try {
    const data = req.body;
    if (!data) {
      return next(createError("Room is required", 400));
    }

    const existingRoomType = await prisma.roomType.findUnique({
      where: { id: data.roomTypeId },
    });

    if (!existingRoomType) {
      return next(
        createError("Room type not found for the provided roomTypeId", 404)
      );
    }

    const existingRoomNumber = await prisma.room.findFirst({
      where: { roomNumber: data.roomNumber },
    });

    if (existingRoomNumber) {
      return next(
        createError("Room number with the same number already exists", 400)
      );
    }

    const room = await prisma.room.create({
      data: data,
    });

    res.status(201).json({ message: "create success", room });
  } catch (err) {
    next(err);
  }
};

exports.addRoomType = async (req, res, next) => {
  try {
    const data = req.body;

    if (!data) {
      return next(createError("Room is required", 400));
    }

    const existingRoomType = await prisma.roomType.findFirst({
      where: { roomType: data.roomType },
    });

    if (existingRoomType) {
      return next(
        createError("Room type with the same name already exists", 400)
      );
    }

    const roomType = await prisma.roomType.create({
      data: data,
    });

    res.status(201).json({ message: "create success", roomType });
  } catch (err) {
    next(err);
  }
};

exports.updateRoom = async (req, res, next) => {
  try {
    const data = req.body;
    const roomId = +req.params.roomId;
    console.log(roomId);
    const existRoom = await prisma.room.findFirst({
      where: { id: roomId },
    });

    await prisma.room.update({
      data: data,
      where: { id: existRoom.id },
    });

    res.status(200).json({ message: "update success" });
  } catch (err) {
    next(err);
  }
};

exports.updateRoomType = async (req, res, next) => {
  try {
    const data = req.body;
    const roomTypeId = +req.params.roomTypeId;

    if (!data) {
      return next(createError("Room is required", 400));
    }

    const existRoomType = await prisma.roomType.findFirst({
      where: { id: roomTypeId },
    });

    await prisma.roomType.update({
      data: data,
      where: { id: existRoomType.id },
    });

    res.status(200).json({ message: "update success" });
  } catch (err) {
    next(err);
  }
};

exports.deleteRoom = async (req, res, next) => {
  try {
    const roomId = +req.params.roomId;

    const existRoom = await prisma.room.findFirst({
      where: { roomId },
    });

    await prisma.room.delete({
      where: { id: existRoom.id },
    });

    res.status(200).json({ message: "delete success" });
  } catch (err) {
    next(err);
  }
};

exports.deleteRoomType = async (req, res, next) => {
  try {
    const roomTypeId = +req.params.roomTypeId;

    const existRoomType = await prisma.roomType.findFirst({
      where: { id: roomTypeId },
    });

    await prisma.roomType.delete({
      where: { id: existRoomType.id },
    });
    res.status(200).json({ message: "delete success" });
  } catch (err) {
    next(err);
  }
};
