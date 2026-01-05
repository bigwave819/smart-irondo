import { eq } from "drizzle-orm"
import { evidence, reports } from "../db/schema.js";
import { user } from "../db/schema.js";
import { db } from '../db/conn.js'
import crypto from 'crypto'

export const createdByAdmin = async (req, res) => {
  try {
    const { fullName, phone, location } = req.body;

    if (
      !fullName ||
      !phone ||
      !location?.district ||
      !location?.sector ||
      !location?.cell ||
      !location?.village
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.phone, phone))
      .limit(1);


    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const activationCode = crypto.randomInt(100000, 999999).toString();

    await db.insert(user).values({
      fullName,
      phone,
      role: "user",
      isActive: false,
      activationCode,
      location,
    });

    // TODO: send activationCode via SMS

    res.status(201).json({
      message: "User created. Activation code sent.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const updateTheEvidenceStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // 1. Find evidence
        const foundEvidence = await db.query.evidence.findFirst({
            where: eq(evidence.id, Number(id)),
        });

        if (!foundEvidence) {
            return res.status(404).json({ message: "No such evidence found" });
        }

        await db
            .update(evidence)
            .set({ status })
            .where(eq(evidence.id, Number(id)));

        return res.json({
            message: "Evidence status updated successfully",
        });


    } catch (error) {
        res.status(500).json({ message: `the server error due ${error}` })
    }
}

export const deactivateTheUser = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Find user
        const users = await db.query.user.findFirst({
            where: eq(user.id, Number(id)),
        });

        if (!users) {
            return res.status(404).json({ message: "User not found" });
        }

        await db
            .update(user)
            .set({ isActive: false })
            .where(eq(user.id, Number(id)));

        return res.json({
            message: "User deactivated successfully",
        });

    } catch (error) {
        res.status(500).json({ message: `the server error due ${error}` })
    }
}

export const getAllAbanyerondo = async (_, res) => {
    try {
        const users = await db.select().from(user)

        if (users.length === 0) {
            return res.status(404).json({ message: "0 users found" })
        }

        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ message: `the server error due ${error}` })
    }
}

export const getAllReports = async (_, res) => {
    try {
        const data = await db.query.reports.findMany({
            orderBy: [desc(reports.createdAt)],
        });

        return res.status(200).json({
            message: "Reports retrieved successfully",
            total: data.length,
            reports: data,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch reports",
            error: error.message,
        });
    }
}

export const getAllEvidences = async (_, res) => {
    try {
        const data = await db.query.evidence.findMany({
            orderBy: [desc(evidence.createdAt)],
        });

        return res.status(200).json({
            message: "Evidence retrieved successfully",
            total: data.length,
            evidence: data,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch reports",
            error: error.message,
        });
    }
}
