import express from "express";
import corsMiddleware from "cors"
import cookieParser from "cookie-parser"
import { tutorRouter } from "./modules/tutor/tutor.router";
import { userRouter } from "./modules/users/users.router";
import { categoryRouter } from "./modules/category/category.router.js";
import { bookingRouter } from "./modules/bookings/bookings.router";
import { tutorAvailabilityRouter } from "./modules/tutorAvailability/tutorAvailability.router";
import { reviewsRouter } from "./modules/reviews/reviews.router";
import { authRouter } from "./modules/auth/auth.router";
import { studentRouter } from "./modules/student/student.router";
import { tutorCategoriesRouter } from "./modules/tutorCategories/tutorCategories.router";
import { adminRouter } from "./modules/admin/admin.router";

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

app.use('/admin/categories', categoryRouter)

app.use('/api', bookingRouter)

app.use('/api/tutor/availability', tutorAvailabilityRouter)

app.use('/api', reviewsRouter)

app.use('/api/auth', authRouter)

app.use('/dashboard', studentRouter)

app.use('/tutorCategory', tutorCategoriesRouter)

app.use('/admin', adminRouter)

app.get("/", (req, res) => {
    res.send("Hello world")
})

export default app;

