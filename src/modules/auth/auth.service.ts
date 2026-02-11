import { prisma } from "../../lib/prisma.js"
import bcrypt from "bcryptjs";
import generateToken from "../../utils/jwt";


interface RegisterInput {
    name: string;
    email: string;
    password: string;
    role?: "STUDENT" | "TUTOR";
}

interface LoginInput {
    email: string;
    password: string;
}

const registerUser = async (data: RegisterInput) => {

    const existingUser = await prisma.users.findUnique({
        where: { email: data.email },
    });

    if (existingUser) {
        throw { statusCode: 409, message: "User already exists" };
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.users.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role: data.role ?? "STUDENT"
        },
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


    const token = generateToken({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    })

    const { password, ...safeUser } = user;

    return { token, user: safeUser };
};

const loginUser = async (data: LoginInput) => {
    const user = await prisma.users.findUnique({
        where: { email: data.email }
    })

    if (!user) {
        throw { statusCode: 404, message: "User not found" };
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
        throw { statusCode: 401, message: "Invalid email or password" };
    }

    const token = generateToken({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    })

    const { password, ...safeUser } = user;

    return { token, user: safeUser };
}

const currentUser = async (email: string) => {
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
                                    subjectName: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    return user;
};

export const authService = {
    loginUser,
    registerUser,
    currentUser
}