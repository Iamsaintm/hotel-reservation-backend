const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
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
        bookings: true,
        roomType: true,
      },
    });

    const roomNotVacant = await prisma.room.findMany({
      where: {
        bookings: {
          some: {
            AND: [
              {
                OR: [
                  {
                    startDate: {
                      lte: startDate,
                      gte: endDate,
                    },
                  },
                  {
                    endDate: {
                      lte: startDate,
                      gte: endDate,
                    },
                  },
                  {
                    startDate: {
                      lte: startDate,
                    },
                    endDate: {
                      gte: endDate,
                    },
                  },
                ],
              },
              {
                isPayment: {
                  in: ["PENDING", "ACCEPT"],
                },
              },
            ],
          },
        },
      },
      include: {
        bookings: true,
        roomType: true,
      },
    });

    const roomNotVacantIds = roomNotVacant.map((room) => room.id);
    const filteredRooms = rooms.filter(
      (room) => !roomNotVacantIds.includes(room.id)
    );

    res.status(200).json(filteredRooms);
  } catch (err) {
    next(err);
  }
};
