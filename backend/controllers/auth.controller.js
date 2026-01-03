import { eq } from 'drizzle-orm'
import { db } from '../db/conn.js'
import bcryptjs from 'bcryptjs'
import { user } from '../db/schema.js'
import jwtToken from '../utils/jwtToken.js'

export const VerifyActivationCode = async (req, res) => {
    try {
        const { phone, code } = req.body || {}
        if (!phone || !code)
            return res.status(400).json({ message: 'Phone and code required' })

        const existingUser = await db.query.user.findFirst({
            where: eq(user.phone, phone)
        })

        if (!existingUser || existingUser.activationCode !== code) {
            return res.status(400).json({ message: 'Invalid code' })
        }

        res.status(200).json({ message: 'Code verified. proceed to password' })
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error}` })
    }
}

export const ActivateAccount = async (req, res) => {
    try {
        const { phone, password } = req.body || {}
        if (!phone || !password)
            return res.status(400).json({ message: 'Phone and password required' })

        const hashedPassword = await bcryptjs.hash(password, 10)

        await db
            .update(user)
            .set({
                password: hashedPassword,
                isActive: true,
                activationCode: null
            })
            .where(eq(user.phone, phone))

        res.status(200).json({ message: 'Account activated successfully' })
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error}` })
    }
}

export const login = async (req, res) => {
    try {
        const { phone, password } = req.body || {}
        if (!phone || !password)
            return res.status(400).json({ message: 'Phone and password required' })

        const existingUser = await db.select().from(user).where(eq(user.phone, phone));

        const existingUsers = existingUser[0];

        if (!existingUsers || existingUsers.isActive !== true ) {
            return res.status(401).json({ message: "Account not active" });
        }

        const isMatch = await bcryptjs.compare(password, existingUsers.password)
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid Credentials' })
        }

        const token = jwtToken({ id: existingUser.id, role: existingUser.role })

        res.status(200).json({
            token,
            user: {
                id: existingUsers.id,
                fullName: existingUsers.fullName,
                phone: existingUsers.phone,
                role: existingUsers.role,
                location: existingUsers.location,
            },
        })
    } catch (error) {
        return res.status(500).json({ message: `Server error: ${error}` })
    }
}
