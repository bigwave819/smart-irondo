import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import { ENV } from '../config/env.js'
import * as Schema from './schema.js'

const pool = new Pool({ connectionString: ENV.DB_URL })

pool.on("connect", () => {
    console.log(`db connected successfully`);
})

pool.on("error", (err) => {
    console.log(`error due to ${err}`);
})

export const db = drizzle(pool, { Schema })