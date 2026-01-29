import { prisma } from "../../lib/prisma"
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';


interface RegisterInput {
    name: string;
    email: string;
    password: string;
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
        throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.users.create({
        data: {
            ...data,
            password: hashedPassword,
        },
    });

    const secret = process.env.JWT_SECRET!;
    const token = jwt.sign(
        {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        secret,
        { expiresIn: "7d" }
    );

    const { password, ...safeUser } = user;

    return { token, user: safeUser };
};

const loginUser = async (data: LoginInput) => {
    const user = await prisma.users.findUnique({
        where: { email: data.email }
    })
    
    if (!user) {
        throw new Error("Invalid Credentials")
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
        throw new Error("Invalid Credentials")
    }

    const secret = process.env.JWT_SECRET!;
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, secret, {
        expiresIn: "7d"
    })

    return { token, user }
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