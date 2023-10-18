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

    const availableRooms = await prisma.room.findFirst({
      where: {
        NOT: {
          bookings: {
            some: {
              startDate: { lte: endDate },
              endDate: { gte: startDate },
            },
          },
        },
        roomId: +data.roomId,
        isMaintenance: false,
      },
    });

    if (availableRooms) {
      return next(createError("Selected room does not exist", 400));
    }

    const timeDifference = endDate - startDate;

    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
    const totalPrice = daysDifference * roomType.roomPrice;

    const room = await prisma.booking.create({
      data: {
        roomsId: {
          connect: {
            id: +availableRooms.id,
          },
        },
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
    const bookingId = +req.params.bookingId;

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
    const bookingId = +req.params.bookingId;
    console.log(bookingId);
    await prisma.booking.delete({
      where: { id: bookingId },
    });

    res.status(200).json({ message: "delete success" });
  } catch (err) {
    next(err);
  }
};

exports.acceptRequest = async (req, res, next) => {
  try {
    const bookingId = +req.params.bookingId;

    await prisma.booking.update({
      data: {
        isPayment: "ACCEPT",
      },
      where: {
        id: bookingId,
      },
    });

    res.status(200).json({ message: "Accept" });
  } catch (err) {
    next(err);
  }
};

exports.rejectRequest = async (req, res, next) => {
  try {
    const bookingId = +req.params.bookingId;

    await prisma.booking.update({
      data: {
        isPayment: "REJECT",
      },
      where: {
        id: bookingId,
      },
    });

    res.status(200).json({ message: "Reject" });
  } catch (err) {
    next(err);
  }
};
