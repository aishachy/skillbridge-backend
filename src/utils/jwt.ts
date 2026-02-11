import jwt from "jsonwebtoken";

interface JwtPayload {
  id: number;
  name: string,
  email: string,
  role: "STUDENT" | "TUTOR" | "ADMIN";
}

const generateToken = (payload: JwtPayload): string => {
  const secret = process.env.JWT_SECRET!;

  return jwt.sign(payload, secret, {
    expiresIn: "7d",
  });
};

export default generateToken
