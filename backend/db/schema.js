import {
  pgTable,
  serial,
  varchar,
  boolean,
  text,
  jsonb,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const user = pgTable("user", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 100 }).notNull(),
  phone: varchar("phone").notNull().unique(),
  password: text("password"),
  role: varchar("role").notNull().default("user"),
  isActive: boolean("is_Active").default(false),
  activationCode: varchar("activation_code"),
  location: jsonb("location"),
  createdAt: timestamp("created_at").defaultNow(),
})

export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  reportedBy: integer("reported_by").references(() => user.id),
  reportType: varchar("report_type", { length: 30 }),
  incidentType: varchar("incident_type", { length: 50 }),
  title: varchar("title", { length: 150 }),
  noCrime: boolean("no_crime").default(false),
  description: text("description"),
  status: varchar("status", { length: 20 }).default("Submitted"),
  location: jsonb("location").notNull(),
  patrolStartTime: timestamp("patrol_start_time"),
  patrolEndTime: timestamp("patrol_end_time"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const evidence = pgTable("evidence", {
  id: serial("id").primaryKey(),
  reportId: integer("report_id")
    .references(() => reports.id)
    .notNull(),
  uploadedBy: integer("uploaded_by")
    .references(() => user.id)
    .notNull(),
  url: text("url").notNull(),
  type: varchar("type", { length: 10 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const usersRelations = relations(user, ({ many }) => ({
  reports: many(reports),
  evidence: many(evidence),
}));

export const reportsRelations = relations(reports, ({ one, many }) => ({
  reportedBy: one(user, {
    fields: [reports.reportedBy],
    references: [user.id],
  }),
  evidence: many(evidence),
}));

export const evidenceRelations = relations(evidence, ({ one }) => ({
  report: one(reports, {
    fields: [evidence.reportId],
    references: [reports.id],
  }),
  uploadedBy: one(user, {
    fields: [evidence.uploadedBy],
    references: [user.id],
  }),
}));