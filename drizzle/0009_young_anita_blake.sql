CREATE TABLE "condominium_entities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"condominium_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"address" text,
	"whatsapp" varchar(50),
	"phone" varchar(50),
	"email" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "condominium_entities" ADD CONSTRAINT "condominium_entities_condominium_id_condominiums_id_fk" FOREIGN KEY ("condominium_id") REFERENCES "public"."condominiums"("id") ON DELETE no action ON UPDATE no action;