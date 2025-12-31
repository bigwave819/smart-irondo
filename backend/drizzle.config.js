import { defineConfig } from "drizzle-kit";
import { ENV } from "./config/env";

export default defineConfig({
  schema: "./db/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: ENV.DB_URL,
  },
});