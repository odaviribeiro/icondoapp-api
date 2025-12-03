ALTER TYPE "public"."user_role" ADD VALUE 'PENDING' BEFORE 'OWNER';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'PENDING';