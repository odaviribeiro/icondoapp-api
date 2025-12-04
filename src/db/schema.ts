import { relations } from 'drizzle-orm'
import {
  boolean,
  date,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

// ========== ENUMS ==========
export const userRoleEnum = pgEnum('user_role', [
  'PENDING',
  'OWNER',
  'TENANT',
  'DEPENDENT',
  'EMPLOYEE',
  'MANAGER',
  'ADMINISTRATOR',
  'MASTER',
])

// Condominiums
export const condominiums = pgTable('condominiums', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  address: text('address').notNull(),
  cnpj: varchar('cnpj', { length: 18 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
// Condominiums Infos
export const condominiumEntities = pgTable('condominium_entities', {
  id: uuid('id').primaryKey().defaultRandom(),
  condominiumId: uuid('condominium_id')
    .references(() => condominiums.id)
    .notNull(),

  title: varchar('title', { length: 255 }).notNull(),
  // Portaria 1, Administração, Ronda, Síndico, etc.

  address: text('address'),
  whatsapp: varchar('whatsapp', { length: 50 }),
  phone: varchar('phone', { length: 50 }),
  email: varchar('email', { length: 255 }),

  order: integer('order').notNull().default(0),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
// Blocks
export const blocks = pgTable('blocks', {
  id: uuid('id').primaryKey().defaultRandom(),
  condominiumId: uuid('condominium_id')
    .notNull()
    .references(() => condominiums.id),
  name: varchar('name', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const units = pgTable('units', {
  id: uuid('id').primaryKey().defaultRandom(),
  blockId: uuid('block_id')
    .notNull()
    .references(() => blocks.id),
  number: varchar('number', { length: 10 }).notNull(),
  ownerId: uuid('owner_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  birthDate: date('birth_date'),
  acceptedTerms: boolean('accepted_terms').notNull(),
  role: userRoleEnum('role').default('PENDING'),
  unitId: uuid('unit_id')
    .references(() => units.id)
    .default(null),
  condominiumId: uuid('condominium_id')
    .references(() => condominiums.id)
    .default(null),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
})

export const refreshTokens = pgTable('refresh_tokens', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
})

export const condominiumRelations = relations(condominiums, ({ many }) => ({
  entities: many(condominiumEntities),
}))

export const schema = {
  users,
  units,
  blocks,
  condominiums,
  condominiumEntities,
  refreshTokens,
}
export type Schema = typeof schema
