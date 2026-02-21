import { Users } from "@prisma/client";
import { prisma } from "../../lib/prisma.js"

const studentBookings = async (studentId: number) => {
    const result = await prisma.bookings.findMany({
        where: {
            studentId
        },
        include: {
            student: {
                select: {
                    name: true,
                    email: true
                }
            },
            category: {
                select: {
                    subjectName: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    const total = await prisma.bookings.count({
        where: {
            studentId
        }
    })
    return {
        result,
        total
    }
}

const getProfile = async (studentId: number) => {
    const result = prisma.users.findUnique({
        where: { id: studentId },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            createdAt: true
        }
    });
    return result
};

const updateProfile = async (studentId: number, data: Partial<Users>) => {
    const result = prisma.users.update({
        where: { id: studentId },
        data,
        select: {
            id: true,
            name: true,
            email: true,
            phone: true
        }
    });
    return result
};

const getStats = async (userId: number) => {
    const studentProfile = await prisma.tutorProfiles.findUnique({
        where: { userId }
    });

    if (!studentProfile) {
        return {
            totalBookings: 0,
            completedSessions: 0,
            totalSpent: 0,
            upcomingSessions: [],
            pastSessions: []
        };
    }

    const studentId = studentProfile.id;

    // Total Bookings
    const totalBookings = await prisma.bookings.count({
        where: { studentId }
    });

    // Completed Sessions
    const completedSessions = await prisma.bookings.count({
        where: {
            studentId,
            status: "COMPLETED"
        }
    });

    // Total Spent
    const totalSpentResult = await prisma.bookings.aggregate({
        where: {
            studentId,
            status: "COMPLETED"
        },
        _sum: { price: true }
    });

    const totalSpent = totalSpentResult._sum.price ?? 0;

    // Upcoming Sessions
    const upcomingSessions = await prisma.bookings.findMany({
        where: {
            studentId,
            status: "CONFIRMED",
            startTime: {
                gte: new Date()
            }
        },
        orderBy: { startTime: "asc" },
        include: {
            tutor: {
                select: {
                    id: true,
                    bio: true,
                    user: {
                        select: {
                            name: true,
                            email: true
                        }
                    }
                }
            },
            category: {
                select: {
                    subjectName: true
                }
            }
        }
    });

    // Past Sessions
    const pastSessions = await prisma.bookings.findMany({
        where: {
            studentId,
            status: "COMPLETED"
        },
        orderBy: { startTime: "desc" },
        include: {
            tutor: {
                select: {
                    id: true,
                    bio: true,
                    user: {
                        select: {
                            name: true,
                            email: true
                        }
                    }
                }
            },
            category: {
                select: {
                    subjectName: true
                }
            }
        }
    });

    return {
        totalBookings,
        completedSessions,
        totalSpent,
        upcomingSessions,
        pastSessions
    };
};


export const studentService = {
    studentBookings,
    getProfile,
    updateProfile,
    getStats
}