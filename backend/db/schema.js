import { pgTable, serial, varchar, boolean } from "drizzle-orm/pg-core";



export const user = pgTable("user", {
    id: serial("id").primaryKey(),
    fullName: varchar("full_name", { length: 100 }).notNull(),
    phone: varchar("phone").notNull().unique(),
    password: text("password").notNull(),
    role: varchar("role").notNull().default("user"),
    isActive: boolean("is_Active").default(false),
    activationCode: varchar("activation_code"),
    location: jsonb("location").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
})

export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  reportedBy: serial("reported_by").references(() => user.id),
  reportType: varchar("report_type", { length: 30 }),
  incidentType: varchar("incident_type", { length: 50 }),
  description: text("description"),
  status: varchar("status", { length: 20 }).default("Submitted"),
  location: jsonb("location").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const evidence = pgTable("evidence", {
  id: serial("id").primaryKey(),
  reportId: integer("report_id")
    .references(() => reports.id)
    .notNull(),
  uploadedBy: integer("uploaded_by")
    .references(() => users.id)
    .notNull(),
  url: text("url").notNull(),
  type: varchar("type", { length: 10 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});