import { defineConfig } from "drizzle-kit";
import { ENV } from "./config/env";

export default defineConfig({
  schema: "./db/schema.js",
  dialect: "postgresql",
  out: "./drizzle",
  dbCredentials: {
    url: ENV.DB_URL,
  },
});