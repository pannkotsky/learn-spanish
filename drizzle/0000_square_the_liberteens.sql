CREATE TYPE "public"."word_class" AS ENUM('noun', 'verb', 'adjective', 'adverb', 'pronoun', 'preposition', 'conjunction', 'article', 'determiner', 'numeral', 'interjection', 'auxiliary', 'particle', 'other');--> statement-breakpoint
CREATE TABLE "words" (
	"id" serial PRIMARY KEY NOT NULL,
	"mainForm" text NOT NULL,
	"word_class" "word_class" NOT NULL,
	"translationEn" text NOT NULL,
	"translationUa" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
