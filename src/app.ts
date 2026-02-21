import express from "express";
import corsMiddleware from "cors"
import cookieParser from "cookie-parser"
import { tutorRouter } from "./modules/tutor/tutor.router.js";
import { userRouter } from "./modules/users/users.router.js";
import { categoryRouter } from "./modules/category/category.router.js";
import { bookingRouter } from "./modules/bookings/bookings.router.js";
import { tutorAvailabilityRouter } from "./modules/tutorAvailability/tutorAvailability.router.js";
import { reviewsRouter } from "./modules/reviews/reviews.router.js";
import { authRouter } from "./modules/auth/auth.router.js";
import { studentRouter } from "./modules/student/student.router.js";
import { tutorCategoriesRouter } from "./modules/tutorCategories/tutorCategories.router.js";
import { adminRouter } from "./modules/admin/admin.router.js";

const app = express();

app.use(
    corsMiddleware({
        origin: "http://localhost:3000",
        credentials: true, 
    })
);

app.use(express.json())
app.use(cookieParser());


app.use('/api', tutorRouter);

app.use('/admin', userRouter)

app.use('/api/categories', categoryRouter)

app.use('/api', bookingRouter)

app.use('/api/availability', tutorAvailabilityRouter)

app.use('/api', reviewsRouter)

app.use('/api/auth', authRouter)

app.use('/dashboard', studentRouter)

app.use('/tutorCategory', tutorCategoriesRouter)

app.use('/admin', adminRouter)

app.get("/", (req, res) => {
    res.send("Hello world")
})

export default app;

