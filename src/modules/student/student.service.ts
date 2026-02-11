import { Users } from "../../../generated/prisma"
import { prisma } from "../../lib/prisma"

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
    const tutorProfile = await prisma.tutorProfiles.findUnique({
        where: { userId }
    });

    if (!tutorProfile) {
        return {
            totalBookings: 0,
            completedSessions: 0,
            totalSpent: 0,
            upcomingSessions: [],
            pastSessions: []
        };
    }

    const tutorId = tutorProfile.id;
    const totalBookings = await prisma.bookings.count({
        where: {
            tutorId
        }
    });

    const completedSessions = await prisma.bookings.count({
        where: { tutorId, status: "COMPLETED" }
    });

    const totalSpentResult = await prisma.bookings.aggregate({
        where: { tutorId, status: "COMPLETED" },
        _sum: { price: true }
    });
    const totalSpent = totalSpentResult._sum.price ?? 0;

    const upcomingSessions = await prisma.bookings.findMany({
        where: {
            tutorId,
            status: "CONFIRMED"
        },
        orderBy: { startTime: "asc" },
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
        }
    });

    const pastSessions = await prisma.bookings.findMany({
        where: {
            tutorId,
            status: "CONFIRMED"
        },
        include: {
            student: {
                select: {
                    name: true,
                    email: true
                }
            },
            category: { select: { subjectName: true } }
        },
        orderBy: { startTime: "asc" }
    });

    return {
        totalBookings,
        completedSessions,
        totalSpent,
        upcomingSessions,
        pastSessions
    }
}


export const studentService = {
    studentBookings,
    getProfile,
    updateProfile,
    getStats
}