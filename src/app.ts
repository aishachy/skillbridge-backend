import express from "express";
import { tutorRouter } from "./modules/tutor/tutor.router";
import { studentRouter } from "./modules/student/student.router";
import { categoryRouter } from "./modules/cateory/category.router";
import { bookingRouter } from "./modules/bookings/bookings.router";
import { tutorAvailabilityRouter } from "./modules/tutorAvailability/tutorAvailability.router";
import { reviewsRouter } from "./modules/reviews/reviews.router";

const app = express();

app.use(express.json())

app.use('/api', tutorRouter);

app.use('/student', studentRouter)

app.use('/api', categoryRouter)

app.use('/api', bookingRouter)

app.use('/api', tutorAvailabilityRouter)

app.use('/api', reviewsRouter)

app.get("/", (req,res) => {
    res.send("Hello world")
})

export default app;