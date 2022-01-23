START TRANSACTION;
  ALTER TABLE "user_table" DROP COLUMN "email_confirmed";
COMMIT;