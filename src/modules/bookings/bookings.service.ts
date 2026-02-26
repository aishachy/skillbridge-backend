import { prisma } from "../../lib/prisma.js";
import { Bookings, STATUS, AvailabilityStatus } from "@prisma/client";


interface BookTutorInput {
  categoryId: number;
  tutorId: number;
  studentId: number;
  availabilityId: number;
  price: number;
}

interface BookingInput {
  tutorId: number;
  studentId: number;
  categoryId: number;
  startTime: Date;
  endTime: Date;
  price?: number;
  status?: STATUS;
  availabilityId: number;
}

// Service
const createBookings = async (data: BookingInput) => {
  return await prisma.bookings.create({
    data,
    include: {
      student: true,
      tutor: true,
      category: true,
      availability: true,
      reviews: true,
    },
  });
};

const getAllBookings = async () => {
  return await prisma.bookings.findMany({
    include: {
      student: {
        select: { id: true, name: true, email: true, role: true, isBanned: true },
      },
      tutor: true,
      category: true,
      availability: true,
      reviews: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

const getBookingById = async (id: number) => {
  return await prisma.bookings.findUnique({
    where: { id },
    include: {
      student: {
        select: { id: true, name: true, email: true, role: true, isBanned: true },
      },
      tutor: true,
      category: true,
      availability: true,
      reviews: true,
    },
  });
};

const bookTutorSlot = async (data: BookTutorInput) => {
  const slot = await prisma.tutorAvailability.findUnique({
    where: { id: data.availabilityId },
  });

  if (!slot || slot.status !== "AVAILABLE") {
    throw new Error("This slot is not available");
  }

  const booking = await prisma.bookings.create({
    data: {
      tutorId: data.tutorId,
      studentId: data.studentId,
      categoryId: data.categoryId,
      startTime: slot.startTime,
      endTime: slot.endTime,
      price: data.price,
      status: "CONFIRMED",
      availabilityId: slot.id,
    },
    include: {
      student: true,
      tutor: true,
      availability: true,
      category: true,
      reviews: true,
    },
  });

  // Update availability slot
  await prisma.tutorAvailability.update({
    where: { id: slot.id },
    data: {
      status: "BOOKED",
      bookings: { connect: { id: booking.id } }, 
    },
  });

  return booking;
};

const getStudentBookings = async (studentId: number) => {
  return await prisma.bookings.findMany({
    where: { studentId },
    include: {
      tutor: true,
      category: true,
      availability: true,
      reviews: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

const getTutorBookings = async (tutorId: number) => {
  return await prisma.bookings.findMany({
    where: { tutorId },
    include: {
      student: {
        select: { id: true, name: true, email: true, role: true, isBanned: true },
      },
      category: true,
      availability: true,
      reviews: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

const updateBooking = async (
  bookingId: number,
  status: STATUS,
  userId?: number
) => {
  const booking = await prisma.bookings.findUnique({ where: { id: bookingId } });
  if (!booking) throw new Error("Booking not found");

  return await prisma.bookings.update({
    where: { id: bookingId },
    data: { status },
  });
};

const cancelBooking = async (bookingId: number) => {
  const booking = await prisma.bookings.findUnique({
    where: { id: bookingId },
    include: { availability: true },
  });

  if (!booking) throw new Error("Booking not found");

  // Mark booking as cancelled
  await prisma.bookings.update({
    where: { id: bookingId },
    data: { status: "CANCELLED" },
  });

  // Free up the availability slot
  if (booking.availabilityId) {
    await prisma.tutorAvailability.update({
      where: { id: booking.availabilityId },
      data: {
        status: "AVAILABLE",
        bookings: { disconnect: { id: booking.id } }, 
      },
    });
  }

  return { message: "Booking cancelled successfully" };
};

// Export the service
export const bookingsService = {
  createBookings,
  getAllBookings,
  getBookingById,
  bookTutorSlot,
  getStudentBookings,
  getTutorBookings,
  updateBooking,
  cancelBooking,
};