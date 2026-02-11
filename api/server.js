// src/app.ts
import express11 from "express";
import corsMiddleware from "cors";
import cookieParser from "cookie-parser";

// src/modules/tutor/tutor.router.ts
import express from "express";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
var prisma = new PrismaClient();

// src/modules/tutor/tutor.service.ts
var createTutor = async (data) => {
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
};
var getAllTutors = async ({
  search,
  isFeatured,
  minRating,
  categoryNames
}) => {
  const andConditions = [];
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
      ]
    });
  }
  if (typeof isFeatured === "boolean") {
    andConditions.push({
      isFeatured
    });
  }
  if (minRating !== void 0) {
    andConditions.push({ rating: { gte: minRating } });
  }
  if (categoryNames?.length) {
    andConditions.push({
      tutorCategories: {
        some: {
          category: {
            subjectName: { in: categoryNames }
          }
        }
      }
    });
  }
  const result = await prisma.tutorProfiles.findMany({
    where: {
      AND: andConditions,
      user: {
        role: "TUTOR"
      }
    },
    include: {
      reviews: true,
      bookings: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      tutorCategories: {
        include: {
          category: {
            select: { id: true, subjectName: true, description: true }
          }
        }
      }
    }
  });
  return result;
};
var getTutorById = async (id) => {
  const result = await prisma.tutorProfiles.findUnique(
    {
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
  );
  return result;
};
var updateTutor = async (tutorId) => {
  const allCategories = await prisma.categories.findMany({
    select: { id: true }
  });
  const result = await prisma.tutorProfiles.update({
    where: {
      id: tutorId
    },
    data: {
      tutorCategories: {
        deleteMany: {},
        create: allCategories.map((c) => ({
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
  });
  return result;
};
var updateTutorProfile = async (data, userId) => {
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
  });
};
var getStats = async (tutorId) => {
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
  };
};
var tutorService = {
  createTutor,
  getAllTutors,
  getTutorById,
  updateTutor,
  updateTutorProfile,
  getStats
};

// src/modules/tutor/tutor.controller.ts
var createTutors = async (req, res) => {
  try {
    const result = await tutorService.createTutor(req.body);
    res.status(201).json(result);
  } catch (e) {
    res.status(400).json({
      error: "tutor creation failed",
      details: e
    });
  }
};
var getAllTutors2 = async (req, res) => {
  try {
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : void 0;
    const isFeatured = req.query.isFeatured ? req.query.isFeatured === "true" ? true : req.query.isFeatured === "false" ? false : void 0 : void 0;
    const result = await tutorService.getAllTutors({ search: searchString, isFeatured });
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("error:", error);
    res.status(400).json({
      success: false,
      error: "tutors fetch failed",
      details: error
    });
  }
};
var getTutorById2 = async (req, res) => {
  try {
    const tutorId = Number(req.params.id);
    const result = await tutorService.getTutorById(tutorId);
    if (!result) {
      return res.status(404).json({ error: "Tutor not found" });
    }
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({
      error: "tutors by id fetch failed",
      details: e
    });
  }
};
var updateTutor2 = async (req, res) => {
  try {
    const tutorId = Number(req.params.id);
    const result = await tutorService.updateTutor(tutorId);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({
      error: "tutor update failed",
      details: e
    });
  }
};
var updateTutorProfile2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    const result = await tutorService.updateTutorProfile(userId, req.body);
    res.status(200).json({
      success: true,
      message: "Tutor profile updated successfully",
      data: result
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Profile update failed",
      error: err.message
    });
  }
};
var getStats2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    const tutorProfile = await prisma.tutorProfiles.findUnique({
      where: { userId },
      include: {
        user: true
      }
    });
    if (!tutorProfile) {
      return res.status(404).json({ message: "Tutor profile not found" });
    }
    const tutorName = tutorProfile.user.name;
    const stats = await tutorService.getStats(tutorProfile.id);
    res.status(200).json({
      success: true,
      data: {
        tutorName,
        ...stats
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, message: "Stats fetch failed", error: err.message });
  }
};
var tutorController = {
  createTutors,
  getAllTutors: getAllTutors2,
  getTutorById: getTutorById2,
  updateTutor: updateTutor2,
  updateTutorProfile: updateTutorProfile2,
  getStats: getStats2
};

// src/middleware/auth.ts
import jwt from "jsonwebtoken";
var auth = (...roles) => {
  return (req, res, next) => {
    try {
      const header = req.headers?.authorization;
      console.log("REQ HEADERS:", req.headers);
      if (!header?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
      }
      const token = header.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: decoded.id, role: decoded.role };
      console.log("REQ USER:", req.user);
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }
      next();
    } catch (err) {
      return res.status(401).json({ message: err.message });
    }
  };
};
var auth_default = auth;

// src/modules/tutor/tutor.router.ts
var router = express.Router();
router.get("/tutor", tutorController.getAllTutors);
router.get("/tutor/dashboard", auth_default("TUTOR", "ADMIN"), tutorController.getStats);
router.get("/tutor/:id", tutorController.getTutorById);
router.post("/tutor", tutorController.createTutors);
router.put("/tutor/profile/:id", tutorController.updateTutor);
router.put("/tutor/profile", auth_default("TUTOR"), tutorController.updateTutorProfile);
var tutorRouter = router;

// src/modules/users/users.router.ts
import express2 from "express";

// src/modules/users/users.service.ts
import bcrypt from "bcryptjs";
var createUser = async (data) => {
  if (!data.password) {
    throw new Error("Password is required");
  }
  const hashedPass = await bcrypt.hash(data.password, 10);
  const user = await prisma.users.create({
    data: {
      ...data,
      password: hashedPass
    }
  });
  return user;
};
var getAllUser = async (body) => {
  const users = await prisma.users.findMany({
    include: {
      tutorProfiles: true,
      bookings: true,
      reviews: true
    }
  });
  const usersWithTutorArray = users.map((user) => ({
    ...user,
    tutorProfiles: user.tutorProfiles ? [user.tutorProfiles] : []
  }));
  return usersWithTutorArray;
};
var getUserById = async (userId) => {
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true
    }
  });
  if (!user) throw new Error("User not found");
  return user;
};
var updateUser = async (data, userId) => {
  const result = await prisma.tutorProfiles.update({
    where: {
      id: userId
    },
    data
  });
  return result;
};
var deleteUser = async (userId) => {
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
var getStats3 = async (userId) => {
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
              email: true
              // optional
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
  };
};
var banUser = async (userId) => {
  const result = prisma.users.update({
    where: { id: userId },
    data: { isBanned: true }
  });
  return result;
};
var unbanUser = async (userId) => {
  const result = prisma.users.update({
    where: { id: userId },
    data: { isBanned: false }
  });
  return result;
};
var userService = {
  createUser,
  getAllUser,
  getUserById,
  updateUser,
  deleteUser,
  getStats: getStats3,
  banUser,
  unbanUser
};

// src/modules/users/users.controller.ts
var createUser2 = async (req, res) => {
  try {
    const result = await userService.createUser(req.body);
    res.status(201).json(result);
  } catch (e) {
    res.status(400).json({
      error: "student creation failed",
      details: e
    });
  }
};
var getAllUser2 = async (req, res) => {
  try {
    const result = await userService.getAllUser(req.body);
    res.status(201).json(result);
  } catch (e) {
    res.status(400).json({
      error: "student retrievtion failed",
      details: e
    });
  }
};
var getUserById2 = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const result = await userService.getUserById(userId);
    if (!result) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({
      error: "User by id fetch failed",
      details: e
    });
  }
};
var updateUser2 = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const result = await userService.updateUser(req.body, userId);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({
      error: "user update failed",
      details: e
    });
  }
};
var deleteUser2 = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const result = await userService.deleteUser(userId);
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message
    });
  }
};
var getStats4 = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });
    const stats = await userService.getStats(userId);
    res.status(200).json({ success: true, data: stats });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "Stats fetched failed!";
    res.status(400).json({
      error: errorMessage,
      details: e
    });
  }
};
var banUserController = async (req, res) => {
  const userId = Number(req.params.id);
  try {
    const user = await userService.banUser(userId);
    res.json({
      success: true,
      message: "User banned successfully",
      user
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Error banning user",
      error: err
    });
  }
};
var unbanUserController = async (req, res) => {
  const userId = Number(req.params.id);
  try {
    const user = await userService.unbanUser(userId);
    res.json({
      success: true,
      message: "User unbanned successfully",
      user
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Error unbanning user",
      error: err
    });
  }
};
var UserController = {
  createUser: createUser2,
  getAllUser: getAllUser2,
  getUserById: getUserById2,
  updateUser: updateUser2,
  deleteUser: deleteUser2,
  getStats: getStats4,
  banUserController,
  unbanUserController
};

// src/modules/users/users.router.ts
var router2 = express2.Router();
router2.post("/users", UserController.createUser);
router2.get("/", auth_default("ADMIN"), UserController.getStats);
router2.get("/users", auth_default("ADMIN"), UserController.getAllUser);
router2.get("/users/:id", auth_default("ADMIN"), UserController.getUserById);
router2.put("/users/:id", auth_default("ADMIN"), UserController.updateUser);
router2.put("/users/ban/:id", auth_default("ADMIN"), UserController.banUserController);
router2.put("/users/unban/:id", auth_default("ADMIN"), UserController.unbanUserController);
router2.delete("/users/:id", auth_default("ADMIN"), UserController.deleteUser);
var userRouter = router2;

// src/modules/category/category.router.ts
import express3 from "express";

// src/modules/category/category.service.ts
var createCategory = async (data) => {
  const result = await prisma.categories.create({
    data
  });
  return result;
};
var getAllCategories = async (data) => {
  const result = await prisma.categories.findMany({
    include: {
      tutors: true,
      bookings: true
    }
  });
  return result;
};
var getCategoriesById = async (categoryId) => {
  const result = await prisma.categories.findUnique({
    where: { id: categoryId },
    select: {
      id: true,
      subjectName: true,
      description: true,
      tutors: true,
      bookings: true
    }
  });
  if (!result) throw new Error("Category not found");
  return result;
};
var updateCategory = async (data, categoryId) => {
  const result = await prisma.categories.update({
    where: {
      id: categoryId
    },
    data
  });
  return result;
};
var deleteCategory = async (categoryId) => {
  const category = await prisma.categories.findUnique({
    where: {
      id: categoryId
    }
  });
  if (!category) throw new Error("Category not found");
  const result = prisma.categories.delete({
    where: {
      id: categoryId
    }
  });
  return { result, message: "Category deleted successfully" };
};
var categoryService = {
  createCategory,
  getAllCategories,
  getCategoriesById,
  updateCategory,
  deleteCategory
};

// src/modules/category/category.controller.ts
var createCategory2 = async (req, res) => {
  try {
    const result = await categoryService.createCategory(req.body);
    res.status(201).json(result);
  } catch (e) {
    res.status(400).json({
      error: "category creation failed",
      details: e
    });
  }
};
var getAllCategories2 = async (req, res) => {
  try {
    const result = await categoryService.getAllCategories(req.body);
    res.status(201).json(result);
  } catch (e) {
    res.status(400).json({
      error: "category retrievtion failed",
      details: e
    });
  }
};
var getCategoriesById2 = async (req, res) => {
  try {
    const categoryId = Number(req.params.id);
    const result = await categoryService.getCategoriesById(categoryId);
    if (!result) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({
      error: "Category by id fetch failed",
      details: e
    });
  }
};
var updateCategory2 = async (req, res) => {
  try {
    const categoryId = Number(req.params.id);
    const result = await categoryService.updateCategory(req.body, categoryId);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({
      error: "Category update failed",
      details: e
    });
  }
};
var deleteCategory2 = async (req, res) => {
  try {
    const categoryId = Number(req.params.id);
    const result = await categoryService.deleteCategory(categoryId);
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message
    });
  }
};
var categoryController = {
  createCategory: createCategory2,
  getAllCategories: getAllCategories2,
  getCategoriesById: getCategoriesById2,
  updateCategory: updateCategory2,
  deleteCategory: deleteCategory2
};

// src/modules/category/category.router.ts
var router3 = express3.Router();
router3.get("/", auth_default("ADMIN"), categoryController.getAllCategories);
router3.get("/:id", auth_default("ADMIN"), categoryController.getCategoriesById);
router3.post("/", auth_default("ADMIN"), categoryController.createCategory);
router3.put("/:id", auth_default("ADMIN"), categoryController.updateCategory);
router3.delete("/:id", auth_default("ADMIN"), categoryController.deleteCategory);
var categoryRouter = router3;

// src/modules/bookings/bookings.router.ts
import express4 from "express";

// src/modules/bookings/bookings.service.ts
var createBookings = async (data) => {
  const result = await prisma.bookings.create({
    data
  });
  return result;
};
var getAllBookings = async (data) => {
  const result = await prisma.bookings.findMany({
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isBanned: true
        }
      },
      tutor: true,
      category: true
    }
  });
  return result;
};
var getBookingById = async (id) => {
  const result = await prisma.bookings.findUnique({
    where: { id },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isBanned: true
        }
      },
      tutor: true,
      category: true
    }
  });
  return result;
};
var bookingsService = {
  createBookings,
  getAllBookings,
  getBookingById
};

// src/modules/bookings/booking.controller.ts
var createBookings2 = async (req, res) => {
  try {
    const result = await bookingsService.createBookings(req.body);
    res.status(201).json(result);
  } catch (e) {
    res.status(400).json({
      error: "booking creation failed",
      details: e
    });
  }
};
var getAllBookings2 = async (req, res) => {
  try {
    const result = await bookingsService.getAllBookings(req.body);
    res.status(201).json(result);
  } catch (e) {
    res.status(400).json({
      error: "booking fetch failed",
      details: e
    });
  }
};
var getBookingById2 = async (req, res) => {
  try {
    const bookingId = Number(req.params.id);
    const result = await bookingsService.getBookingById(bookingId);
    if (!result) {
      return res.status(404).json({
        error: "Booking not found"
      });
    }
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({
      error: "bookings by id fetch failed",
      details: e
    });
  }
};
var bookingController = {
  createBookings: createBookings2,
  getAllBookings: getAllBookings2,
  getBookingById: getBookingById2
};

// src/modules/bookings/bookings.router.ts
var router4 = express4.Router();
router4.post("/bookings", bookingController.createBookings);
router4.get("/bookings", auth_default("ADMIN"), bookingController.getAllBookings);
router4.get("/bookings/:id", bookingController.getBookingById);
var bookingRouter = router4;

// src/modules/tutorAvailability/tutorAvailability.router.ts
import express5 from "express";

// src/modules/tutorAvailability/tutorAvailability.service.ts
var createTutorAvailability = async (data) => {
  const result = await prisma.tutorAvailability.create({
    data: {
      tutorId: data.tutorId,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      status: data.status,
      bookingId: data.bookingId
    }
  });
  return result;
};
var updateAvailability = async (slotId, data) => {
  if (data.status !== "BOOKED" && data.bookingId !== null) {
    throw new Error("bookingId allowed only when status is BOOKED");
  }
  const result = await prisma.tutorAvailability.update({
    where: {
      id: slotId
    },
    data: {
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      status: data.status,
      bookingId: data.bookingId
    }
  });
  return result;
};
var tutorAvailabilityService = {
  createTutorAvailability,
  updateAvailability
};

// src/modules/tutorAvailability/tutorAvailability.controller.ts
var createTutorAvailability2 = async (req, res) => {
  try {
    const result = await tutorAvailabilityService.createTutorAvailability(req.body);
    res.status(201).json(result);
  } catch (e) {
    res.status(400).json({
      error: "availability creation failed",
      details: e
    });
  }
};
var updateAvailability2 = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        error: "invalid tutor id"
      });
    }
    const slotId = parseInt(id);
    const result = await tutorAvailabilityService.updateAvailability(
      slotId,
      req.body
    );
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ error: "availability update failed", details: e });
  }
};
var tutorAvailabilityController = {
  createTutorAvailability: createTutorAvailability2,
  updateAvailability: updateAvailability2
};

// src/modules/tutorAvailability/tutorAvailability.router.ts
var router5 = express5.Router();
router5.post("/", auth_default("TUTOR"), tutorAvailabilityController.createTutorAvailability);
router5.put("/:id", tutorAvailabilityController.updateAvailability);
var tutorAvailabilityRouter = router5;

// src/modules/reviews/reviews.router.ts
import express6 from "express";

// src/modules/reviews/reviews.service.ts
var createReviews = async (data) => {
  const { bookingId, studentId, rating, comment } = data;
  const booking = await prisma.bookings.findUnique({
    where: { id: bookingId }
  });
  if (!booking) {
    throw new Error("Booking not found");
  }
  if (booking.studentId !== studentId) {
    throw new Error("You can only review your own sessions");
  }
  if (booking.status !== "COMPLETED") {
    throw new Error("You can only review completed sessions");
  }
  const review = await prisma.reviews.create({
    data: {
      bookingId,
      studentId,
      tutorId: booking.tutorId,
      rating,
      ...comment !== void 0 && { comment }
    }
  });
  return review;
};
var reviewsService = {
  createReviews
};

// src/modules/reviews/reviews.controller.ts
var createReviews2 = async (req, res) => {
  try {
    const result = await reviewsService.createReviews(req.body);
    res.status(201).json(result);
  } catch (e) {
    res.status(400).json({
      error: "review creation failed",
      details: e
    });
  }
};
var reviewsController = {
  createReviews: createReviews2
};

// src/modules/reviews/reviews.router.ts
var router6 = express6.Router();
router6.post("/reviews", reviewsController.createReviews);
var reviewsRouter = router6;

// src/modules/auth/auth.router.ts
import express7 from "express";

// src/modules/auth/auth.service.ts
import bcrypt2 from "bcryptjs";

// src/utils/jwt.ts
import jwt2 from "jsonwebtoken";
var generateToken = (payload) => {
  const secret = process.env.JWT_SECRET;
  return jwt2.sign(payload, secret, {
    expiresIn: "7d"
  });
};
var jwt_default = generateToken;

// src/modules/auth/auth.service.ts
var registerUser = async (data) => {
  const existingUser = await prisma.users.findUnique({
    where: { email: data.email }
  });
  if (existingUser) {
    throw { statusCode: 409, message: "User already exists" };
  }
  const hashedPassword = await bcrypt2.hash(data.password, 10);
  const user = await prisma.users.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role ?? "STUDENT"
    }
  });
  if (user.role === "TUTOR") {
    await prisma.tutorProfiles.create({
      data: {
        user: {
          connect: {
            id: user.id
          }
        }
      }
    });
  }
  const token = jwt_default({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  });
  const { password, ...safeUser } = user;
  return { token, user: safeUser };
};
var loginUser = async (data) => {
  const user = await prisma.users.findUnique({
    where: { email: data.email }
  });
  if (!user) {
    throw { statusCode: 404, message: "User not found" };
  }
  const isMatch = await bcrypt2.compare(data.password, user.password);
  if (!isMatch) {
    throw { statusCode: 401, message: "Invalid email or password" };
  }
  const token = jwt_default({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  });
  const { password, ...safeUser } = user;
  return { token, user: safeUser };
};
var currentUser = async (email) => {
  const user = await prisma.users.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      tutorProfiles: {
        select: {
          id: true,
          bio: true,
          education: true,
          experience: true,
          perHourRate: true,
          location: true,
          rating: true,
          isActive: true,
          tutorCategories: {
            select: {
              category: {
                select: {
                  id: true,
                  subjectName: true
                }
              }
            }
          }
        }
      }
    }
  });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};
var authService = {
  loginUser,
  registerUser,
  currentUser
};

// src/modules/auth/auth.controller.ts
var loginUser2 = async (req, res) => {
  try {
    const { token, user } = await authService.loginUser(req.body);
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1e3
    });
    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      user
    });
  } catch (e) {
    return res.status(e.statusCode || 401).json({
      success: false,
      message: e.message || "Login failed"
    });
  }
};
var registerUser2 = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const { token, user } = await authService.registerUser({
      name,
      email,
      password,
      role
    });
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1e3
    });
    return res.status(201).json({
      success: true,
      message: "Registered successfully",
      token,
      user
    });
  } catch (e) {
    return res.status(400).json({
      success: false,
      message: "Registration failed",
      details: e.message
    });
  }
};
var currentUser2 = async (req, res) => {
  try {
    const userId = req.user?.id;
    console.log(userId);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        tutorProfiles: {
          select: {
            id: true,
            bio: true,
            education: true,
            experience: true,
            perHourRate: true,
            location: true,
            rating: true,
            tutorCategories: {
              select: {
                category: {
                  select: { id: true, subjectName: true }
                }
              }
            }
          }
        }
      }
    });
    if (!user) throw new Error("User not found");
    return res.status(200).json({ success: true, user });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};
var authController = {
  loginUser: loginUser2,
  registerUser: registerUser2,
  currentUser: currentUser2
};

// src/modules/auth/auth.router.ts
var router7 = express7.Router();
router7.post("/login", authController.loginUser);
router7.post("/register", authController.registerUser);
router7.get("/me", authController.currentUser);
var authRouter = router7;

// src/modules/student/student.router.ts
import express8 from "express";

// src/modules/student/student.service.ts
var studentBookings = async (studentId) => {
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
  });
  const total = await prisma.bookings.count({
    where: {
      studentId
    }
  });
  return {
    result,
    total
  };
};
var getProfile = async (studentId) => {
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
  return result;
};
var updateProfile = async (studentId, data) => {
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
  return result;
};
var getStats5 = async (userId) => {
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
  };
};
var studentService = {
  studentBookings,
  getProfile,
  updateProfile,
  getStats: getStats5
};

// src/modules/student/student.controller.ts
var studentBookings2 = async (req, res) => {
  try {
    const studentId = Number(req.params.studentId);
    const result = await studentService.studentBookings(studentId);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (e) {
    console.error("dashboard fetched failed:", e);
    res.status(400).json({
      error: "Overview fetch failed",
      details: e.message
    });
  }
};
var getProfile2 = async (req, res) => {
  try {
    const studentId = Number(req.params.studentId);
    const profile = await studentService.getProfile(studentId);
    if (!profile) return res.status(404).json({ success: false, message: "Student not found" });
    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: err.message
    });
  }
};
var updateProfile2 = async (req, res) => {
  try {
    const studentId = Number(req.params.studentId);
    if (!studentId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const updated = await studentService.updateProfile(studentId, req.body);
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updated
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Profile update failed",
      error: err.message
    });
  }
};
var getStats6 = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });
    const stats = await studentService.getStats(userId);
    res.status(200).json({ success: true, data: stats });
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "Stats fetched failed!";
    res.status(400).json({
      error: errorMessage,
      details: e
    });
  }
};
var studentController = {
  studentBookings: studentBookings2,
  getProfile: getProfile2,
  updateProfile: updateProfile2,
  getStats: getStats6
};

// src/modules/student/student.router.ts
var router8 = express8.Router();
router8.get("/bookings", auth_default("STUDENT"), studentController.studentBookings);
router8.get("/", auth_default("STUDENT"), studentController.getStats);
router8.put("/profile", auth_default("STUDENT"), studentController.updateProfile);
var studentRouter = router8;

// src/modules/tutorCategories/tutorCategories.router.ts
import express9 from "express";

// src/modules/tutorCategories/tutorCategories.service.ts
var createTutorCategories = async (data) => {
  const result = await prisma.tutorCategories.create({
    data: {
      tutorId: data.tutorId,
      categoryId: data.categoryId
    }
  });
  return result;
};
var getAllTutorCategories = async (data) => {
  const result = await prisma.tutorCategories.findMany({
    include: {
      tutor: true,
      category: true
    }
  });
  return result;
};
var tutorCategoriesService = {
  createTutorCategories,
  getAllTutorCategories
};

// src/modules/tutorCategories/tutorCategories.controller.ts
var createTutorCategory = async (req, res) => {
  try {
    const result = await tutorCategoriesService.createTutorCategories({
      tutorId: Number(req.body.tutorId),
      categoryId: Number(req.body.categoryId)
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Tutor category creation failed"
    });
  }
};
var getAllCategories3 = async (req, res) => {
  try {
    const result = await tutorCategoriesService.getAllTutorCategories(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      details: error
    });
  }
};
var tutorCategoriesController = {
  createTutorCategory,
  getAllCategories: getAllCategories3
};

// src/modules/tutorCategories/tutorCategories.router.ts
var router9 = express9.Router();
router9.post("/", auth_default("ADMIN"), tutorCategoriesController.createTutorCategory);
router9.get("/", auth_default("ADMIN"), tutorCategoriesController.getAllCategories);
var tutorCategoriesRouter = router9;

// src/modules/admin/admin.router.ts
import express10 from "express";

// src/modules/admin/admin.service.ts
var adminService = {
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

// src/modules/admin/admin.controller.ts
var adminController = {
  getStatistics: async (req, res) => {
    try {
      const stats = await adminService.getDashboardStats();
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : "Failed to fetch statistics";
      res.status(500).json({
        success: false,
        message: errorMessage
      });
    }
  }
};

// src/modules/admin/admin.router.ts
var router10 = express10.Router();
router10.get("/statistics", auth_default("ADMIN"), adminController.getStatistics);
var adminRouter = router10;

// src/app.ts
var app = express11();
app.use(
  corsMiddleware({
    origin: "http://localhost:3000",
    credentials: true
  })
);
app.use(express11.json());
app.use(cookieParser());
app.use("/api", tutorRouter);
app.use("/admin", userRouter);
app.use("/admin/categories", categoryRouter);
app.use("/api", bookingRouter);
app.use("/api/tutor/availability", tutorAvailabilityRouter);
app.use("/api", reviewsRouter);
app.use("/api/auth", authRouter);
app.use("/dashboard", studentRouter);
app.use("/tutorCategory", tutorCategoriesRouter);
app.use("/admin", adminRouter);
app.get("/", (req, res) => {
  res.send("Hello world");
});
var app_default = app;

// src/server.ts
var PORT = process.env.PORT || 5e3;
async function main() {
  try {
    await prisma.$connect();
    console.log("connected to the database successfully");
    app_default.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("an error occured", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();
