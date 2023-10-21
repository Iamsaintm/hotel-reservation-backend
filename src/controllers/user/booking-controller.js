const prisma = require("../../models/prisma");
const createError = require("../../utils/create-error");

exports.getBooking = async (req, res, next) => {
  try {
    const booking = await prisma.booking.findMany({
      where: { userId: req.user.id },
      include: {
        usersId: true,
        roomsId: {
          include: {
            roomType: true,
          },
        },
      },
    });

    if (!booking || booking.length === 0) {
      return next(createError("Booking not found", 404));
    }

    res.status(200).json(booking);
  } catch (err) {
    next(err);
  }
};

exports.createBooking = async (req, res, next) => {
  try {
    const userId = +req.user.id;

    const data = req.body;
    if (!data) {
      return next(createError("Room is required", 400));
    }

    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    const roomNumber = await prisma.room.findFirst({
      where: { id: +data.roomId },
    });

    const roomType = await prisma.roomType.findFirst({
      where: { id: roomNumber.roomTypeId },
    });

    const timeDifference = endDate - startDate;

    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
    const totalPrice = daysDifference * roomType.roomPrice;

    const room = await prisma.booking.create({
      data: {
        roomsId: {
          connect: {
            id: +roomNumber.id,
          },
        },
        startDate: startDate,
        endDate: endDate,
        totalPrice: totalPrice,
        usersId: {
          connect: {
            id: userId,
          },
        },
        roomAvailable: "OCCUPIED",
      },
    });

    res.status(201).json({ message: "create success", room });
  } catch (err) {
    next(err);
  }
};

exports.updateBooking = async (req, res, next) => {
  try {
    const data = req.body;
    const userId = +req.user.id;
    const bookingId = +req.params.bookingId;

    if (!data) {
      return next(createError("Room is required", 400));
    }

    const existBooking = await prisma.booking.findFirst({
      where: { id: bookingId, userId },
    });

    if (!existBooking) {
      return next(createError("Booking does not exist", 400));
    }

    await prisma.booking.update({
      data: data,
      where: { id: bookingId },
    });

    res.status(200).json({ message: "update success" });
  } catch (err) {
    next(err);
  }
};

exports.deleteBooking = async (req, res, next) => {
  try {
    const userId = +req.user.id;
    const bookingId = +req.params.bookingId;

    const existBooking = await prisma.booking.findFirst({
      where: { id: bookingId, userId: userId },
    });

    if (!existBooking) {
      return next(createError("Booking does not exist", 400));
    }

    await prisma.booking.delete({
      where: { id: bookingId },
    });

    const newBooking = await prisma.booking.findMany({
      where: { userId: userId },
    });

    res.status(200).json({ message: "delete success", newBooking });
  } catch (err) {
    next(err);
  }
};
