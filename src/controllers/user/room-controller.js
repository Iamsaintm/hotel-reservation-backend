const prisma = require("../../models/prisma");
const createError = require("../../utils/create-error");

exports.getRoom = async (req, res, next) => {
  try {
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

    const roomType = await prisma.roomType.findFirst({
      where: { id: availableRooms.roomTypeId },
    });

    const room = [availableRooms, roomType];
    console.log(room);
    res.status(200).json(room);
  } catch (err) {
    next(err);
  }
};
