import { Prisma, STATUS, TutorProfiles } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";

interface UpdateTutorInput {
  categoryId: any;
  bio?: string;
  education?: string;
  experience?: string;
  perHourRate?: string;
  location?: string;
}

interface updateProfileInput {
  bio?: string
  education?: string
  experience?: string
  perHourRate?: string
  location?: string
}

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
  categoryNames,
}: {
  search: string | undefined;
  isFeatured: boolean | undefined;
  minRating?: number;
  categoryNames?: string[];
}) => {
  const andConditions: Prisma.TutorProfilesWhereInput[] = [];

  // Search filter
  if (search) {
    andConditions.push({
      OR: [
        { bio: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
      ],
    });
  }

  // Featured filter
  if (typeof isFeatured === "boolean") {
    andConditions.push({ isFeatured });
  }

  // Rating filter
  if (minRating !== undefined) {
    andConditions.push({ rating: { not: null,  gte: minRating } });
  }

  // Category filter
  if (categoryNames?.length) {
    andConditions.push({
      tutorCategories: {
        some: { category: { subjectName: { in: categoryNames } } },
      },
    });
  }

  try {
    const tutors = await prisma.tutorProfiles.findMany({
      where: {
        user: { role: "TUTOR" },
        ...(andConditions.length > 0 && { AND: andConditions }),
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        reviews: {
          include: {
            student: { select: { id: true, name: true } },
          },
        },

        bookings: {
          include: {
            student: { select: { id: true, name: true } },
            category: { select: { id: true, subjectName: true } },
          },
        },
        // tutorCategories: {
        //   include: { category: { select: { id: true, subjectName: true } } },
        // },
      },
    });

    return tutors;
  } catch (err) {
    console.error("Error fetching tutors:", err);
    throw new Error("failed to fetch");
  }
};


const getTutorById = async (id: number) => {
  const result = await prisma.tutorProfiles.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      reviews: {
        include: {
          student: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },

      bookings: {
        include: {
          student: { select: { id: true, name: true, email: true } },
          category: { select: { id: true, subjectName: true } },
        },
      },
      tutorCategories: {
        include: { category: { select: { id: true, subjectName: true } } }
      },
    },
  }
  )
  return result
}

const updateTutor = async (tutorId: number, data: UpdateTutorInput) => {
  // Prepare category updates if categoryIds are provided
  let categoriesUpdate = undefined;
  if (data.categoryId) {
    categoriesUpdate = {
      deleteMany: {},
      create: data.categoryId.map((id: any) => ({
        category: { connect: { id } }
      }))
    };
  }

  const { categoryId, ...profileData } = data;

  const result = await prisma.tutorProfiles.update({
    where: { id: tutorId },
    data: {
      ...profileData,
      ...(categoriesUpdate ? { tutorCategories: categoriesUpdate } : {}),
    },
    include: {
      tutorCategories: {
        include: { category: true }
      }
    }
  });
  return result
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

const deleteTutor = async (id: number) => {
  return prisma.tutorProfiles.delete({
    where: { id }
  });
};

const getStats = async (userId?: number) => {
  if (!userId) {
    throw new Error("User ID is required for fetching tutor stats");
  }

  // Get tutor profile
  const tutorProfile = await prisma.tutorProfiles.findUnique({
    where: { userId },
  });
  if (!tutorProfile) {
    throw new Error("Tutor profile not found");
  }

  const tutorId = tutorProfile.id;

  // Total bookings
  const totalBookings = await prisma.bookings.count({ where: { tutorId } });

  // Completed sessions
  const completedSessions = await prisma.bookings.count({
    where: { tutorId, status: "COMPLETED" },
  });

  // Total earnings
  const totalEarningsResult = await prisma.bookings.aggregate({
    where: { tutorId, status: "COMPLETED" },
    _sum: { price: true },
  });
  const totalEarnings = totalEarningsResult._sum.price ?? 0;

  // Upcoming sessions
  const upcomingSessions = await prisma.bookings.findMany({
    where: { tutorId, status: "CONFIRMED" },
    include: { student: { select: { name: true, email: true } }, category: { select: { subjectName: true } } },
    orderBy: { startTime: "asc" },
  });

  // Past sessions
  const pastSessions = await prisma.bookings.findMany({
    where: { tutorId, status: "COMPLETED" },
    include: { student: { select: { name: true, email: true } }, category: { select: { subjectName: true } } },
    orderBy: { startTime: "desc" },
  });

  return { totalBookings, completedSessions, totalEarnings, upcomingSessions, pastSessions };
};


const getTutorBookings = async (userId: number) => {
  const tutorProfile = await prisma.tutorProfiles.findUnique({
    where: { userId }
  })

  if (!tutorProfile) {
    throw new Error("Tutor profile not found")
  }

  const bookings = await prisma.bookings.findMany({
    where: {
      tutorId: tutorProfile.id,
    },
    include: {
      student: true,
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return bookings;
};

const updateBookingStatus = async (
  bookingId: number,
  status: STATUS,
  userId: number
) => {
  const tutorProfile = await prisma.tutorProfiles.findUnique({
    where: { userId },
  });

  if (!tutorProfile) {
    throw new Error("Tutor profile not found");
  }

  const booking = await prisma.bookings.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  // security check
  if (booking.tutorId !== tutorProfile.id) {
    throw new Error("Unauthorized");
  }

  const updated = await prisma.bookings.update({
    where: { id: bookingId },
    data: { status },
  });

  return updated;
};



export const tutorService = {
  createTutor,
  getAllTutors,
  getTutorById,
  updateTutor,
  updateTutorProfile,
  deleteTutor,
  getStats,
  getTutorBookings,
  updateBookingStatus
}

