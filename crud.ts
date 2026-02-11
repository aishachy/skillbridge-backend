
async function run() {
    // const createUser = await prisma.users.create({
    //     data : {
    //         name: 'Aysha Aziz',
    //         email: 'aishaazizz30@gmail.com',
    //         phone: '01304567822'
    //     }
    // })

    // console.log("Created User", createUser);

    //create tutor profile

    // const createTutorProfile = await prisma.tutorProfiles.create({
    //     data : {
    //         name: 'Lukman Ahmed',
    //         bio: 'I am a dedicated and patient tutor with a passion for helping students achieve their academic goals. I specialize in making complex topics easy to understand through clear explanations and practical examples. My teaching approach focuses on building confidence, encouraging critical thinking, and adapting lessons to each student’s learning style.',
    //         education: "Master's complete",
    //         experience: '10 years',
    //         perHourRate: '2k',
    //         location: 'Dhaka',
    //         userId: 1
    //     }
    // })

    // console.log("created Tutor Profile:", createTutorProfile);

    //create categories

    // const createCategories =  await prisma.categories.create({
    //     data : {
    //         subjectName: 'Physics',
    //         description: 'Study of matter, energy, motion, and the fundamental forces of nature.'
    //     }
    // })

    // console.log("Created categories:", createCategories);

    //create bookings 

    // const createBookings = await prisma.bookings.create({
    //     data: {
    //         studentId: 1,
    //         tutorId: 1,
    //         categoryId: 1,
    //         startTime: new Date('2026-02-01 10:00:00'),
    //         endTime: new Date('2026-04-01 10:00:00'),

    //     }
    // })

    // console.log("Created Bookings:", createBookings);

    //create reviews

    // const createReviews = await prisma.reviews.create({
    //     data: {
    //         studentId: 1,
    //         tutorId: 1,
    //         bookingId: 1,
    //         rating: "5",
    //     }
    // })

    // console.log("Created Reviews:", createReviews);

    //retrive all users

    // const users = await prisma.users.findMany({
    //     include: {
    //         tutorProfiles: true,
    //         bookings: true,
    //         reviews: true
    //     }
    // })

    // console.dir(users, {depth: Infinity});

    // update user data

    // const updateUser = await prisma.users.update({
    //     where: {
    //        id : 1
    //     },
    //     data: {
    //         phone: '01345644448'
    //     }
    // })

    // console.log("Updated user:", updateUser);

    // delete user 

    // const deleteUser = await prisma.users.delete({
    //     where: {
    //         id: 1
    //     }
    // })
}

run()