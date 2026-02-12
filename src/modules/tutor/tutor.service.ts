import { Prisma, TutorProfiles } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";



const createTutor = async (data: TutorProfiles) => {
 return prisma.tutorProfiles.create({
    data,
    include: {
      tutorCategories: {
        include: {
          category: true
        }
      }
    }
  });
}

const getAllTutors = async ({
  search,
  isFeatured,
  minRating,
  categoryNames
}: {
  search: string | undefined,
  isFeatured: boolean | undefined,
  minRating?: number;
  categoryNames?: string[];
}) => {
  const andConditions: Prisma.TutorProfilesWhereInput[] = [];
  if (search) {
    andConditions.push({
      OR: [
        {
          bio: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          perHourRate: {
            contains: search,
            mode: "insensitive"
          }
        }
      ],
    })
  }

  if (typeof isFeatured === 'boolean') {
    andConditions.push({
      isFeatured
    })
  }

  if (minRating !== undefined) {
    andConditions.push({ rating: { gte: minRating } });
  }
  if (categoryNames?.length) {
    andConditions.push({
      tutorCategories: {
        some: {
          category: {
            subjectName: { in: categoryNames },
          },
        },
      },
    }as Prisma.TutorProfilesWhereInput);
  }
  const result = await prisma.tutorProfiles.findMany({
    where: {
      AND: andConditions,
      user: {
        role: "TUTOR",
      },
    },
    include: {
      reviews: true,
      bookings: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      tutorCategories: {
        include: {
          category: {
            select: { id: true, subjectName: true, description: true },
          },
        },
      },
    },
  });

  return result;
};


const getTutorById = async (id: number) => {
  const result = await prisma.tutorProfiles.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      reviews: true,
      bookings: true,
      tutorCategories: {
        include: {
          category: { select: { id: true, subjectName: true } }
        }
      }
    }
  }
  )
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
    data: {
      tutorCategories: {
        deleteMany: {},
        create: allCategories.map((c:any) => ({
          category: { connect: { id: c.id } }
        }))
      }
    },
    include: {
      tutorCategories: {
        include: {
          category: true
        }
      }
    }
  })
  return result
}

interface updateProfileInput {
  bio?: string
  education?: string
  experience?: string
  perHourRate?: string
  location?: string
}

const updateTutorProfile = async (data: updateProfileInput, userId: number) => {
  const result = await prisma.tutorProfiles.findUnique({
    where: {
      userId
    }
  });
  if (!result) throw new Error("Tutor profile not found");
  return prisma.tutorProfiles.update({
    where: {
      id: result.id
    },
    data
  })
}

const getStats = async (tutorId: number) => {
  const totalBookings = await prisma.bookings.count({ where: { tutorId } });
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