import { Users } from "../../../generated/prisma";
import { prisma } from "../../lib/prisma.js";
import bcrypt from "bcryptjs"

const createUser = async (data: Users) => {
    if (!data.password) {
        throw new Error("Password is required");
    }
    const hashedPass = await bcrypt.hash(data.password, 10)
    const user = await prisma.users.create({
        data: {
            ...data,
            password: hashedPass,
        },
    })
    return user;
}

const getAllUser = async (body: any) => {
    const users = await prisma.users.findMany({
        include: {
            tutorProfiles: true,
            bookings: true,
            reviews: true
        }
    })
    const usersWithTutorArray = users.map((user: { tutorProfiles: any; }) => ({
        ...user,
        tutorProfiles: user.tutorProfiles ? [user.tutorProfiles] : [],
    }));

    return usersWithTutorArray;
}


const getUserById = async (userId: number) => {
    const user = await prisma.users.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    if (!user) throw new Error("User not found");
    return user;
};


const updateUser = async (data: Users, userId: number) => {
    const result = await prisma.tutorProfiles.update({
        where: {
            id: userId
        },
        data
    })
    return result
}

const deleteUser = async (userId: number) => {
    const user = await prisma.users.findUnique({
        where: {
            id: userId
        }
    });
    if (!user) throw new Error("User not found");

    const result = prisma.users.delete({
        where: {
            id: userId
        }
    });
    return { result, message: "User deleted successfully" };
};

const getStats = async (userId: number) => {
    const totalUsers = await prisma.users.count();
    const totalStudents = await prisma.users.count({ where: { role: "STUDENT" } });
    const totalTutors = await prisma.users.count({ where: { role: "TUTOR" } });

    const totalBookings = await prisma.bookings.count();
    const completedSessions = await prisma.bookings.count({ where: { status: "COMPLETED" } });

    const revenueResult = await prisma.bookings.aggregate({
        where: { status: "COMPLETED" },
        _sum: { price: true }
    });
    const totalRevenue = revenueResult._sum.price ?? 0;

    const activeTutors = await prisma.tutorProfiles.count({ where: { isActive: true } });

    const recentBookings = await prisma.bookings.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
            student: { select: { name: true } },
            tutor: {
                select: {
                    user: {
                        select: {
                            name: true,
                            email: true, // optional
                        }
                    }
                }
            },
            category: { select: { subjectName: true } }
        }
    });
    return {
        totalUsers,
        totalStudents,
        totalTutors,
        totalBookings,
        completedSessions,
        totalRevenue,
        activeTutors,
        recentBookings
    }
}

const banUser = async (userId: number) => {
    const result = prisma.users.update({
        where: { id: userId },
        data: { isBanned: true },
    });
    return result
};

const unbanUser = async (userId: number) => {
    const result = prisma.users.update({
        where: { id: userId },
        data: { isBanned: false },
    });
    return result
};

export const userService = {
    createUser,
    getAllUser,
    getUserById,
    updateUser,
    deleteUser,
    getStats,
    banUser,
    unbanUser
}