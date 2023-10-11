const bcrypt = require("bcryptjs");
const prisma = require("../src/models/prisma");

const hashPassword = bcrypt.hashSync("123456", 10);

const user = [
  {
    email: "saint@gmail.com",
    password: hashPassword,
    firstName: "Saint",
    lastName: "Nevers",
    status: "ADMIN",
    phoneNumber: "8726776628",
  },
  {
    email: "bud@gmail.com",
    password: hashPassword,
    firstName: "Bud",
    lastName: "Sagger",
    status: "USER",
    phoneNumber: "5964533068",
  },
  {
    email: "tricia@gmail.com",
    password: hashPassword,
    firstName: "Tricia",
    lastName: "Dutch",
    status: "USER",
    phoneNumber: "6928486437",
  },
  {
    email: "elias@gmail.com",
    password: hashPassword,
    firstName: "Elias",
    lastName: "Pfiffer",
    status: "USER",
    phoneNumber: "4011721411",
  },
  {
    email: "sherman@gmail.com",
    password: hashPassword,
    firstName: "Sherman",
    lastName: "Peplow",
    status: "USER",
    phoneNumber: "4011721455",
  },
];

const roomType = [
  { roomType: "Standard room", guestLimit: "4", roomPrice: "3000" },
  { roomType: "Superior room", guestLimit: "4", roomPrice: "4500" },
  { roomType: "Executive room", guestLimit: "4", roomPrice: "5500" },
  { roomType: "Honeymoon suite", guestLimit: "2", roomPrice: "6000" },
  { roomType: "Jacuzzi suite", guestLimit: "2", roomPrice: "6500" },
  { roomType: "Family room", guestLimit: "6", roomPrice: "6000" },
];

const room = [
  { roomNumber: "101", isMaintenance: false, roomTypeId: 6 },
  { roomNumber: "102", isMaintenance: false, roomTypeId: 6 },
  { roomNumber: "103", isMaintenance: false, roomTypeId: 1 },
  { roomNumber: "104", isMaintenance: false, roomTypeId: 1 },
  { roomNumber: "105", isMaintenance: false, roomTypeId: 1 },
  { roomNumber: "201", isMaintenance: true, roomTypeId: 2 },
  { roomNumber: "202", isMaintenance: false, roomTypeId: 2 },
  { roomNumber: "203", isMaintenance: false, roomTypeId: 3 },
  { roomNumber: "204", isMaintenance: true, roomTypeId: 3 },
  { roomNumber: "205", isMaintenance: false, roomTypeId: 3 },
  { roomNumber: "301", isMaintenance: false, roomTypeId: 4 },
  { roomNumber: "303", isMaintenance: true, roomTypeId: 4 },
  { roomNumber: "303", isMaintenance: false, roomTypeId: 4 },
  { roomNumber: "304", isMaintenance: false, roomTypeId: 5 },
  { roomNumber: "305", isMaintenance: true, roomTypeId: 5 },
];

const booking = [
  {
    userId: 2,
    roomId: 3,
    extraBed: 0,
    startDate: "2023-10-12T00:00:00Z",
    endDate: "2023-10-13T00:00:00Z",
    totalPrice: "6000",
  },
  {
    userId: 3,
    roomId: 8,
    extraBed: 0,
    startDate: "2023-10-01T00:00:00Z",
    endDate: "2023-10-02T00:00:00Z",
    totalPrice: "11000",
  },
  {
    userId: 4,
    roomId: 14,
    extraBed: 0,
    startDate: "2023-10-12T00:00:00Z",
    endDate: "2023-10-13T00:00:00Z",
    totalPrice: "13000",
  },
];

async function seedDatabase() {
  await prisma.user.createMany({ data: user });
  await prisma.roomType.createMany({ data: roomType });
  await prisma.room.createMany({ data: room });
  await prisma.booking.createMany({ data: booking });
}

seedDatabase()
  .catch((error) => {
    console.error(error);
  })
  .finally(() => {
    prisma.$disconnect();
  });
