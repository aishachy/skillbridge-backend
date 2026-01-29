import express from "express";
import { tutorRouter } from "./modules/tutor/tutor.router";
import { userRouter } from "./modules/users/users.router";
import { categoryRouter } from "./modules/category/category.router.js";
import { bookingRouter } from "./modules/bookings/bookings.router";
import { tutorAvailabilityRouter } from "./modules/tutorAvailability/tutorAvailability.router";
import { reviewsRouter } from "./modules/reviews/reviews.router";
import { authRouter } from "./modules/auth/auth.router";

const app = express();

app.use(express.json())

app.use('/api', tutorRouter);

app.use('/api', userRouter)

app.use('/api', categoryRouter)

app.use('/api', bookingRouter)

app.use('/api', tutorAvailabilityRouter)

app.use('/api', reviewsRouter)

app.use('/api/auth', authRouter)

app.get("/", (req,res) => {
    res.send("Hello world")
})

export default app;