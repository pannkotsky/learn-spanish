ALTER TABLE "words" ADD COLUMN "frequency" double precision NOT NULL DEFAULT 0;
ALTER TABLE "words" ALTER COLUMN "frequency" DROP DEFAULT;
