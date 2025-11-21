import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { schema, Schema } from './schema'
import { env } from '../lib'

let dbInstance: ReturnType<typeof drizzle<Schema>> | null = null

export function getDb(): ReturnType<typeof drizzle<Schema>> {
  if (!dbInstance) {
    const pool = new Pool({ connectionString: env.DATABASE_URL })
    dbInstance = drizzle<Schema>(pool, { schema })
  }
  return dbInstance
}
