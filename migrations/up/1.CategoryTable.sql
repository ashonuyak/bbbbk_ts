START TRANSACTION;
  CREATE TABLE "category_table" (
      id serial PRIMARY KEY,
      category_name varchar not null
  );
COMMIT;