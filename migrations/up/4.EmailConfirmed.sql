START TRANSACTION;
  ALTER TABLE "user_table" ADD "email_confirmed" BOOLEAN default false;
COMMIT;