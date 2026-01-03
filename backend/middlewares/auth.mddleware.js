import { ENV } from '../config/env.js'
import jwt from 'jsonwebtoken'
import { db } from '../db/conn.js'
import { eq } from 'drizzle-orm';
import { user as UserTable } from "../db/schema.js";


export const ProtectedRoute = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "not token provided" })
        }

        const decoded = jwt.verify(token, ENV.JWT_SECRET)

        const user = await db.query.user.findFirst({
            where: eq(UserTable.id, decoded.id),
            columns: {
                password: false
            }
        })

        if (!user) return res.status(401).json({ message: "User not found" });

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized - user not found" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden - admin access only" });
  }

  next();
};