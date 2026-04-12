ALTER TABLE "verb_forms" ALTER COLUMN "paradigm" SET DATA TYPE text USING "paradigm"::text;--> statement-breakpoint
DELETE FROM "verb_forms" WHERE "paradigm" IN ('infinitive', 'past_participle');--> statement-breakpoint
DROP TYPE "public"."verb_paradigm";--> statement-breakpoint
CREATE TYPE "public"."verb_paradigm" AS ENUM('indicative_present', 'indicative_preterite', 'indicative_imperfect', 'indicative_future', 'indicative_conditional', 'indicative_present_perfect', 'indicative_pluperfect', 'indicative_future_perfect', 'indicative_conditional_perfect', 'indicative_past_anterior', 'subjunctive_present', 'subjunctive_imperfect_ra', 'subjunctive_imperfect_se', 'subjunctive_future', 'subjunctive_present_perfect', 'subjunctive_pluperfect', 'imperative_affirmative', 'imperative_negative', 'gerund');--> statement-breakpoint
ALTER TABLE "verb_forms" ALTER COLUMN "paradigm" SET DATA TYPE "public"."verb_paradigm" USING "paradigm"::"public"."verb_paradigm";
