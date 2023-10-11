require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const notFoundMiddleware = require("./middlewares/not-found");
const errorMiddleware = require("./middlewares/error");
const rateLimitMiddleware = require("./middlewares/rate-limit");
const authRoute = require("./routes/auth-route");
const adminRoomRoute = require("./routes/admin/room-route");
const adminBookingRoute = require("./routes/admin/booking-route");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(rateLimitMiddleware);
app.use(express.json());

app.use("/auth", authRoute);
app.use("/admin/room", adminRoomRoute);
app.use("/admin/booking", adminBookingRoute);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
