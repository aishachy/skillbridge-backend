import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken";

const auth = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const header = req.headers.authorization;
            if (!header || !header.startsWith("Bearer ")) {
                return res.status(401).json({ success: false, message: "No token provided" });
            }
            const token = header.split(" ")[1];
            const decoded = jwt.verify(token!, process.env.JWT_SECRET as string) as JwtPayload
            req.user = decoded
            console.log("Decoded token:", decoded);
            console.log("Auth header:", req.headers.authorization);
            console.log("Decoded token:", decoded);


            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(500).json({
                    error: "unauthorized"
                })
            }
            next()
        } catch (err: any) {
            res.status(500).json({
                success: false,
                message: err.message
            })
        }
    }
}

export default auth;