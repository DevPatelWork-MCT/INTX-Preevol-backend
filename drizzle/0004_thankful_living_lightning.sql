ALTER TABLE "FinancialSettings" DROP CONSTRAINT "FinancialSettings_CompanyID_Company_CompanyID_fk";
--> statement-breakpoint
ALTER TABLE "FinancialSettings" ALTER COLUMN "CompanyID" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "FinancialSettings" ALTER COLUMN "FinancialYear" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "FinancialSettings" ALTER COLUMN "StartDate" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "FinancialSettings" ALTER COLUMN "EndDate" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "FinancialSettings" ADD CONSTRAINT "FinancialSettings_CompanyID_Company_CompanyID_fk" FOREIGN KEY ("CompanyID") REFERENCES "public"."Company"("CompanyID") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "FinancialSettings" DROP COLUMN "Company";