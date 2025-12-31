import { eq } from "drizzle-orm"
import { evidence } from "../db/schema";
import { user } from "../db/schema";
import crypto from 'crypto'

export const createdByAdmin = async (req, res) => {
    try {
        const { fullName, phone, location } = req.body

        if (!fullName || !phone || !location) {
            return res.status(400).json({ message: 'all fields are requires' })
        }

        const existingUser = await db.query.user.findFirst({
            where: eq(phone)
        })

        if (existingUser) {
            return res.status(400).json({ message: 'User exists' })
        }

        const activationCode = crypto.randomInt(100000, 999999)

        await db.insert(user).values({
            fullName,
            phone,
            role: "user",
            isActive: false,
            activationCode,
            location
        })

        //  TODO:SEND VIA SMS

        res.status(201).json({
            message: "User created and Active code sent successfully"
        });
    } catch (error) {
        res.status(500).json({ message: 'internal server error' })
    }
}

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
        return res.status(500).json({ message: `the server error due ${error}` })
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
        
    }
}