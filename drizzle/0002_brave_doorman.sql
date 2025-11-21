ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT null;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "unit_id" SET DEFAULT null;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "condominium_id" SET DEFAULT null;