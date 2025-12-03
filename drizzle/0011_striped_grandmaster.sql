ALTER TABLE "condominiums" ADD CONSTRAINT "condominiums_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "condominiums" ADD CONSTRAINT "condominiums_cnpj_unique" UNIQUE("cnpj");