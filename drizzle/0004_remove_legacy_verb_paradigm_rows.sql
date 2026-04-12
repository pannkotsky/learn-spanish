-- Removes infinitive / past participle paradigm rows if they still exist (e.g. DB
-- never ran 0003, or was restored from a backup). Safe no-op after 0003.
DELETE FROM "verb_forms" WHERE "paradigm"::text IN ('infinitive', 'past_participle');
