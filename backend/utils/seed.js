import bcryptjs from "bcryptjs";
import { db } from "../db/conn.js";
import { user } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const seedAdmin = async () => {

  const existing = await db
  .select()
  .from(user)
  .where(eq(user.phone, '0781234567'))
  .limit(1);

  if (existing) {
    console.log("✅ Admin already exists, skipping...");
    return;
  }

  const hashedPassword = await bcryptjs.hash("Admin@123", 10);

  await db.insert(userTable).values({
    fullName: "System Administrator",
    phone: "0798342542",
    password: hashedPassword,
    role: "admin",
    isActive: true,
    location: null, // ✅ allowed
  });

  console.log("✅ Admin user seeded successfully");
};
