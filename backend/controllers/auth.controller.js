import { eq } from 'drizzle-orm'
import { db } from '../db/conn.js'
import bcryptjs from 'bcryptjs'
import { user } from '../db/schema.js'
import jwtToken from '../utils/jwtToken.js'

export const VerifyActivationCode = async (req, res) => {
    try {
        const { phone, activationCode } = req.body || {};
        
        if (!phone || !activationCode) {
            return res.status(400).json({ message: 'Phone and code required' });
        }

        // Drizzle returns an array
        const users = await db.select().from(user).where(eq(user.phone, phone)).limit(1);
        const existingUser = users[0]; // Access the first user found

        if (!existingUser) {
            console.log('❌ No user found with phone:', phone);
            return res.status(400).json({ message: 'No such User' });
        }

        // Compare the code (Ensure types match, e.g., String vs Number)
        if (String(existingUser.activationCode) !== String(activationCode)) {
            console.log('❌ Invalid Code provided for user:', phone);
            return res.status(400).json({ message: 'Invalid Code' });
        }

        console.log('✅ User verified successfully:', phone);

        return res.status(200).json({ 
            message: 'Code verified. proceed to password',
            phone: existingUser.phone // Helpful for the frontend storage
        });

    } catch (error) {
        console.error('🔥 Server Error:', error);
        return res.status(500).json({ message: `Server error: ${error.message}` });
    }
};

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

        const token = jwtToken({ id: existingUsers.id, role: existingUsers.role })

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


export const checkUser = async (req, res) => {
  try {
    const { phone } = req.params;
    if (!phone) return res.status(400).json({ message: 'Phone required' });

    const existingUser = await db.select().from(user).where(eq(user.phone, phone));
    if (!existingUser[0]) return res.status(200).json({ isActive: false });

    res.status(200).json({ isActive: existingUser[0].isActive });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }
};