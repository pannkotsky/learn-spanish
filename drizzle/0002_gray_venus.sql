CREATE TYPE "public"."verb_paradigm" AS ENUM('indicative_present', 'indicative_preterite', 'indicative_imperfect', 'indicative_future', 'indicative_conditional', 'indicative_present_perfect', 'indicative_pluperfect', 'indicative_future_perfect', 'indicative_conditional_perfect', 'indicative_past_anterior', 'subjunctive_present', 'subjunctive_imperfect_ra', 'subjunctive_imperfect_se', 'subjunctive_future', 'subjunctive_present_perfect', 'subjunctive_pluperfect', 'imperative_affirmative', 'imperative_negative', 'infinitive', 'gerund', 'past_participle');--> statement-breakpoint
CREATE TABLE "verb_forms" (
	"id" serial PRIMARY KEY NOT NULL,
	"word_id" integer NOT NULL,
	"paradigm" "verb_paradigm" NOT NULL,
	"first_person_singular" text NOT NULL,
	"first_person_plural" text NOT NULL,
	"second_person_singular" text NOT NULL,
	"second_person_plural" text NOT NULL,
	"third_person_singular" text NOT NULL,
	"third_person_plural" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "verb_forms_word_id_paradigm_unique" UNIQUE("word_id","paradigm")
);
--> statement-breakpoint
ALTER TABLE "verb_forms" ADD CONSTRAINT "verb_forms_word_id_words_id_fk" FOREIGN KEY ("word_id") REFERENCES "public"."words"("id") ON DELETE cascade ON UPDATE no action;
