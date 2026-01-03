CREATE TABLE "evidence" (
	"id" serial PRIMARY KEY NOT NULL,
	"report_id" integer NOT NULL,
	"uploaded_by" integer NOT NULL,
	"url" text NOT NULL,
	"type" varchar(10) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"reported_by" integer,
	"report_type" varchar(30),
	"incident_type" varchar(50),
	"title" varchar(150),
	"no_crime" boolean DEFAULT false,
	"description" text,
	"status" varchar(20) DEFAULT 'Submitted',
	"location" jsonb NOT NULL,
	"patrol_start_time" timestamp,
	"patrol_end_time" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar(100) NOT NULL,
	"phone" varchar NOT NULL,
	"password" text NOT NULL,
	"role" varchar DEFAULT 'user' NOT NULL,
	"is_Active" boolean DEFAULT false,
	"activation_code" varchar,
	"location" jsonb,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "user_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
ALTER TABLE "evidence" ADD CONSTRAINT "evidence_report_id_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."reports"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence" ADD CONSTRAINT "evidence_uploaded_by_user_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_reported_by_user_id_fk" FOREIGN KEY ("reported_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;