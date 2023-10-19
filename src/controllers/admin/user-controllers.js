const prisma = require("../../models/prisma");
const createError = require("../../utils/create-error");

exports.getUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findMany();

    if (!user || user.length === 0) {
      return next(createError("user not found", 404));
    }
    delete user.password;
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};
