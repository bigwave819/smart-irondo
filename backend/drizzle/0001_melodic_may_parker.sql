CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"sender_id" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
