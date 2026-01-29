import { Users } from "../../../generated/prisma"
import { prisma } from "../../lib/prisma"

const studentBookings = async (studentId: number) => {
    const result = await prisma.bookings.findMany({
        where: {
            studentId
        },
        include: {
            tutor: {
                select: {
                    name: true,
                    category: {
                        select: {
                            subjectName: true
                        }
                    }
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

const updateProfile = async (studentId: number, data: Users) => {
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

const getStats = async (studentId: number) => {
    const totalBookings = await prisma.bookings.count({
        where: {
            studentId
        }
    });

    const completedSessions = await prisma.bookings.count({
        where: { studentId, status: "COMPLETED" }
    });

    const totalSpentResult = await prisma.bookings.aggregate({
        where: { studentId, status: "COMPLETED" },
        _sum: { price: true }
    });
    const totalSpent = totalSpentResult._sum.price ?? 0;

    const upcomingSessions = await prisma.bookings.findMany({
        where: {
             studentId, 
             status: "CONFIRMED"
        },
        include: {
            tutor: { select: { name: true } },
            category: { select: { subjectName: true } }
        },
        orderBy: { startTime: "asc" }
    });

    const pastSessions = await prisma.bookings.findMany({
        where: {
             studentId, 
             status: "CONFIRMED"
        },
        include: {
            tutor: { select: { name: true } },
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