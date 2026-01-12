import bcryptjs from "bcryptjs";
import { db } from "../db/conn.js";
import { user } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const seedAdmin = async () => {
  const ADMIN_PHONE = "0798342542";
  const ADMIN_PASSWORD = "Admin@123";

  try {
    // 1. Correctly check if the array has length
    const existing = await db
      .select()
      .from(user)
      .where(eq(user.phone, ADMIN_PHONE))
      .limit(1);

    if (existing.length > 0) {
      console.log("ℹ️ Admin already exists, skipping...");
      return;
    }

    // 2. Hash password
    const hashedPassword = await bcryptjs.hash(ADMIN_PASSWORD, 10);

    // 3. Insert using the correct table variable (user)
    await db.insert(user).values({
      fullName: "System Administrator",
      phone: ADMIN_PHONE,
      password: hashedPassword,
      role: "admin",
      isActive: true,
      location: null,
    });

    console.log("✅ Admin user seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    process.exit(1);
  }
};