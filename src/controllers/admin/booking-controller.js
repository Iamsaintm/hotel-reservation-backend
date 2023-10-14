const prisma = require("../../models/prisma");
const createError = require("../../utils/create-error");

exports.getBooking = async (req, res, next) => {
  try {
    const booking = await prisma.booking.findMany();

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
    const userId = +req.params.userId;

    const data = req.body;
    if (!data) {
      return next(createError("Room is required", 400));
    }

    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    const availableRooms = await prisma.room.findMany({
      where: {
        NOT: {
          bookings: {
            some: {
              startDate: { lte: endDate },
              endDate: { gte: startDate },
            },
          },
        },
        isMaintenance: false,
      },
    });

    if (availableRooms) {
      return next(createError("Selected room does not exist", 400));
    }

    const roomNumber = await prisma.room.findUnique({
      where: { id: +roomIdToCheck },
    });

    if (!roomNumber) {
      return next(createError("Selected room does not exist", 400));
    }

    const timeDifference = endDate - startDate;

    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
    const totalPrice =
      daysDifference * ((data.extraBed = 0) * 500 + roomType.roomPrice);

    const room = await prisma.booking.create({
      data: {
        roomsId: {
          connect: {
            id: +roomNumber.id,
          },
        },
        extraBed: (data.extraBed = 0),
        startDate: data.startDate,
        endDate: data.endDate,
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
    const userId = +req.params.userId;
    const roomId = +req.params.roomId;

    const existBooking = await prisma.booking.findFirst({
      where: { roomId: roomId, userId: userId },
    });

    await prisma.booking.update({
      data: data,
      where: { id: existBooking.id },
    });

    res.status(200).json({ message: "update success" });
  } catch (err) {
    next(err);
  }
};

exports.deleteBooking = async (req, res, next) => {
  try {
    const userId = +req.params.userId;
    const roomId = +req.params.roomId;

    const existBooking = await prisma.booking.findFirst({
      where: { roomId: roomId, userId: userId },
    });

    await prisma.booking.delete({
      where: { id: existBooking.id },
    });

    res.status(200).json({ message: "delete success" });
  } catch (err) {
    next(err);
  }
};

exports.acceptRequest = async (req, res, next) => {
  try {
    const userId = +req.params.userId;
    const roomId = +req.params.roomId;
    const existBooking = await prisma.booking.findFirst({
      where: { roomId: roomId, userId: userId, isPayment: "PENDING" },
    });

    if (!existBooking) {
      return next(createError("Booking does not exist", 400));
    }

    await prisma.booking.update({
      data: {
        isPayment: "ACCEPT",
      },
      where: {
        id: existBooking.id,
      },
    });

    res.status(200).json({ message: "Accept" });
  } catch (err) {
    next(err);
  }
};

exports.rejectRequest = async (req, res, next) => {
  try {
    const userId = +req.params.userId;
    const roomId = +req.params.roomId;
    const existBooking = await prisma.booking.findFirst({
      where: { roomId: roomId, userId: userId, isPayment: "PENDING" },
    });

    if (!existBooking) {
      return next(createError("Booking does not exist", 400));
    }

    await prisma.booking.update({
      data: {
        isPayment: "REJECT",
      },
      where: {
        id: existBooking.id,
      },
    });

    res.status(200).json({ message: "Reject" });
  } catch (err) {
    next(err);
  }
};
