import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  phone: text('phone'),
  bloodGroup: text('blood_group').notNull(),
  area: text('area').notNull(),
  city: text('city').notNull(),
  isDonor: boolean('is_donor').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const contactRequests = pgTable('contact_requests', {
  id: serial('id').primaryKey(),
  requesterId: integer('requester_id')
    .notNull()
    .references(() => users.id),
  donorId: integer('donor_id')
    .notNull()
    .references(() => users.id),
  status: text('status').default('pending'),
  message: text('message'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const ratings = pgTable('ratings', {
  id: serial('id').primaryKey(),
  donorId: integer('donor_id')
    .notNull()
    .references(() => users.id),
  raterId: integer('rater_id')
    .notNull()
    .references(() => users.id),
  rating: integer('rating').notNull(), // 1-5 stars
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow(),
});
