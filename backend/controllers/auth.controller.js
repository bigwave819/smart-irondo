import { eq } from 'drizzle-orm'
import { db } from '../db/conn.js'
import bcryptjs from 'bcryptjs'
import { user } from '../db/schema.js'
import jwtToken from '../utils/jwtToken.js'

export const VerifyActivationCode = async (req, res) => {
    try {
        const { phone, code } = req.body

        const user = await db.query.user.findFirst({
            where: eq(user.phone, phone)
        })

        if (!user || user.activationCode !== code) {
            return res.status(400).json({ message: 'Invalid code' })
        }

        res.status(200).json({ message: 'Code verified. proceed to password' })
    } catch (error) {
        return res.status(500).json({ message: `the server error due ${error}` })
    }
}

export const ActivateAccount = async (req, res) => {
    try {
        const { phone, password } = req.body

        const hashedPassword = await bcryptjs.hash(password, 10)

        await db
            .update(user)
            .set({
                password: hashedPassword,
                isActive: true,
                activationCode: null
            })
            .where(eq(user.phone, phone))
    } catch (error) {
        return res.status(500).json({ message: `the server error due ${error}` })
    }
}

export const login = async (req, res) => {
    try {
        const { phone, password } = req.body

        const user = await db.query.user.findFirst({
            where: eq(user.phone, phone)
        })

        if (!user || !user.isActive) {
            return res.status(401).json({ message: "Account not active" });
        }

        isMatch = await bcryptjs.compare(password, user.password)

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid Credetials' })
        }

        const token = jwtToken({ payload: user.id, payload: user.role })

        res.status(200).json({
            token,
            user: {
                id: user.id,
                fullName: user.fullName,
                phone: user.phone,
                role: user.role,
                location: user.location,
            },
        })
    } catch (error) {
        return res.status(500).json({ message: `the server error due ${error}` })
    }
}