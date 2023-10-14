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

    const availableRooms = await prisma.room.findMany({
      where: {
        NOT: {
          AND: {
            bookings: {
              some: {
                startDate: { lte: endDate },
                endDate: { gte: startDate },
              },
            },
            roomType: {
              guestLimit: { gte: data.guestLimit },
            },
          },
        },
        isMaintenance: false,
      },
    });

    const roomType = await prisma.roomType.findMany({
      where: { id: availableRooms.roomTypeId },
    });

    const room = [availableRooms, roomType];
    res.status(200).json(room);
  } catch (err) {
    next(err);
  }
};
