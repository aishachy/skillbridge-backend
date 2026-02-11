import { prisma } from "../../lib/prisma.js";

export const adminService = {
    getDashboardStats: async () => {

        const totalUsers = await prisma.users.count();

        const totalTutors = await prisma.users.count({
            where: { role: "TUTOR" }
        });

        const totalStudents = await prisma.users.count({
            where: { role: "STUDENT" }
        });

        const totalBookings = await prisma.bookings.count();

        const revenueResult = await prisma.bookings.aggregate({
            _sum: { price: true }
        });
        const totalRevenue = revenueResult._sum.price ?? 0;

        const bookingsByCategory = await prisma.bookings.groupBy({
            by: ["categoryId"],
            _count: { id: true },
            orderBy: { _count: { id: "desc" } }
        });

        return {
            totalUsers,
            totalTutors,
            totalStudents,
            totalBookings,
            totalRevenue,
            bookingsByCategory
        };
    }
};
