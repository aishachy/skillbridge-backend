import { TutorProfiles } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createTutor = async (data: TutorProfiles) => {
  const result = await prisma.tutorProfiles.create({
    data: {
      ...data
    },
    include: {
      category: true
    }
  })
  return result;
}

const getAllTutors = async (payload: { search?: string | undefined }) => {

  const result = await prisma.tutorProfiles.findMany({
    where: {
      user: {
        role: "TUTOR",
      }, OR: [
        {
          category: {
            some: {
              subjectName: {
                contains: payload.search as string,
                mode: "insensitive",
              },
            },
          },
        },
        {
          category: {
            some: {
              description: {
                contains: payload.search as string,
                mode: "insensitive",
              },
            },
          },
        },
      ],
    },
    include: {
      user: true,
      reviews: true,
      bookings: true,
      category: true,
    }
  });

  return result;
};


const getTutorById = async (id: number) => {
  const result = await prisma.tutorProfiles.findUnique({
    where: { id },
    include: {
      user: true,
      reviews: true,
      bookings: true,
      category: true
    }
  })
  return result
}

const updateTutor = async (tutorId: number) => {
  const allCategories = await prisma.categories.findMany({
    select: { id: true },
  });

  const result = await prisma.tutorProfiles.update({
    where: {
      id: tutorId
    },
    data : {
      category: {
         set: allCategories.map((c) =>  ({ id: c.id }))
      }
    },
    include: {
      category: true
    }
  })
  return result
}

interface updateProfileInput {
  name?: string
  bio?: string
  education?: string
  experience?: string
  perHourRate?: string
  location?: string
}

const updateTutorProfile = async (data: updateProfileInput, tutorId: number) => {
  const result = prisma.tutorProfiles.update({
    where: { id: tutorId },
    data
  });
  return result
}

const getStats = async (tutorId: number) => {
  const totalBookings = await prisma.bookings.count({
    where: {
      tutorId
    }
  });

  const completedSessions = await prisma.bookings.count({
    where: { tutorId, status: "COMPLETED" }
  });

  const totalEarningResult = await prisma.bookings.aggregate({
    where: { tutorId, status: "COMPLETED" },
    _sum: { price: true }
  });
  const totalEarnings = totalEarningResult._sum.price ?? 0;

  const upcomingSessions = await prisma.bookings.findMany({
    where: {
      tutorId,
      status: "CONFIRMED"
    },
    include: {
      student: { select: { name: true, email: true } },
      category: { select: { subjectName: true } }
    },
    orderBy: { startTime: "asc" }
  });

  const pastSessions = await prisma.bookings.findMany({
    where: {
      tutorId,
      status: "COMPLETED"
    },
    include: {
      student: { select: { name: true, email: true } },
      category: { select: { subjectName: true } }
    },
    orderBy: { startTime: "asc" }
  });

  return {
    totalBookings,
    completedSessions,
    totalEarnings,
    upcomingSessions,
    pastSessions
  }
}


export const tutorService = {
  createTutor,
  getAllTutors,
  getTutorById,
  updateTutor,
  updateTutorProfile,
  getStats
}