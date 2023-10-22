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
    if (startDate >= endDate) {
      return next(
        createError("Start date cannot be greater than end date", 400)
      );
    }

    const rooms = await prisma.room.findMany({
      where: {
        roomType: {
          guestLimit: { gte: data.guestLimit },
        },
        isMaintenance: false,
      },
      include: {
        bookings: {
          where: {
            AND: [
              {
                startDate: { lte: endDate },
                endDate: { gte: startDate },
              },
              {
                isPayment: { in: ["ACCEPT", "REJECT"] },
              },
            ],
          },
        },
        roomType: true,
      },
    });

    const availableRooms = rooms.filter((room) => {
      const booking = room.bookings.some((booking) => {
        const bookingStartDate = new Date(booking.startDate);
        const bookingEndDate = new Date(booking.endDate);

        return (
          bookingStartDate <= endDate &&
          bookingEndDate >= startDate &&
          booking.isPayment === "REJECT"
        );
      });

      return !booking;
    });

    if (availableRooms.length === 0) {
      return next(createError("No room available", 400));
    }

    res.status(200).json((room = availableRooms));
  } catch (err) {
    next(err);
  }
};
