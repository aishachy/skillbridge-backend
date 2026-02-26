import { Users } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";


const studentBookings = async (studentId: number) => {
    const result = await prisma.bookings.findMany({
        where: { studentId },
        include: {
            tutor: {
                select: {
                    id: true,
                    bio: true,
                    user: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                },
            },
            category: {
                select: {
                    subjectName: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    const total = await prisma.bookings.count({
        where: { studentId },
    });

    return {
        result,
        total,
    };
};


const getProfile = async (studentId: number) => {
    return prisma.users.findUnique({
        where: { id: studentId },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            createdAt: true,
        },
    });
};


const updateProfile = async (
    studentId: number,
    data: Partial<Users>
) => {
    return prisma.users.update({
        where: { id: studentId },
        data,
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
        },
    });
};

const getStats = async (userId?: number) => {
    if (!userId) {
        throw new Error("User ID is required for fetching student stats");
    }

    const studentId = userId;

    // Total bookings
    const totalBookings = await prisma.bookings.count({
        where: { studentId },
    });

    // Completed sessions
    const completedSessions = await prisma.bookings.count({
        where: { studentId, status: "COMPLETED" },
    });

    // Total spent
    const totalSpentResult = await prisma.bookings.aggregate({
        where: { studentId, status: "COMPLETED" },
        _sum: { price: true },
    });
    const totalSpent = totalSpentResult._sum.price ?? 0;

    // Upcoming sessions
    const upcomingSessions = await prisma.bookings.findMany({
        where: { studentId, status: "CONFIRMED", startTime: { gte: new Date() } },
        include: {
            tutor: { select: { id: true, bio: true, user: { select: { name: true, email: true } } } },
            category: { select: { subjectName: true } },
        },
        orderBy: { startTime: "asc" },
    });

    // Past sessions
    const pastSessions = await prisma.bookings.findMany({
        where: { studentId, status: "COMPLETED" },
        include: {
            tutor: { select: { id: true, bio: true, user: { select: { name: true, email: true } } } },
            category: { select: { subjectName: true } },
        },
        orderBy: { startTime: "desc" },
    });

    return { totalBookings, completedSessions, totalSpent, upcomingSessions, pastSessions };
};

export const studentService = {
    studentBookings,
    getProfile,
    updateProfile,
    getStats,
};