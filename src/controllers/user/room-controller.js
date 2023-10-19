const prisma = require("../../models/prisma");
const createError = require("../../utils/create-error");

exports.getRoom = async (req, res, next) => {
  try {
    const data = req.query;
    if (!data.startDate || !data.endDate || !data.guestLimit) {
      return next(createError("All search parameters are required", 400));
    }

    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    if (startDate > endDate) {
      return next(
        createError("Start date cannot be greater than end date", 400)
      );
    }

    if (startDate !== endDate) {
      return next(createError("Start date cannot be same end date", 400));
    }

    const availableRooms = await prisma.room.findMany({
      where: {
        roomType: {
          guestLimit: { gte: data.guestLimit },
        },
        isMaintenance: false,
      },
      include: {
        bookings: {
          where: {
            OR: [
              {
                startDate: {
                  lte: endDate,
                },
                endDate: {
                  gte: startDate,
                },
              },
              {
                startDate: {
                  gte: startDate,
                  lte: endDate,
                },
              },
            ],
          },
        },
        roomType: true,
      },
    });

    const roomsWithoutOverlappingBookings = availableRooms.filter(
      (room) => room.bookings.length === 0
    );

    if (roomsWithoutOverlappingBookings.length === 0) {
      return next(
        createError(`No available rooms for the specified date range`, 400)
      );
    }

    res.status(200).json((room = roomsWithoutOverlappingBookings));
  } catch (err) {
    next(err);
  }
};
