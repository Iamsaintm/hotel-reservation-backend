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

    const availableRooms = await prisma.room.findMany({
      where: {
        roomType: {
          guestLimit: { gte: data.guestLimit },
        },
        isMaintenance: false,
      },
    });

    if (availableRooms.length === 0 && !availableRooms) {
      return next(createError(`No room for ${data.guestLimit} people`, 400));
    }

    const roomType = await prisma.roomType.findMany({
      where: { id: availableRooms.roomTypeId },
    });

    const room = [availableRooms, roomType];
    res.status(200).json(room);
  } catch (err) {
    next(err);
  }
};
