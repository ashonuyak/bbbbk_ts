START TRANSACTION;
  CREATE TABLE "info_table" (
      id serial PRIMARY KEY,
      country varchar not null,
      city varchar not null,
      rate varchar not null,
      stack varchar not null,
      id_category integer,
      foreign key (id_category) references category_table(id)
  );
COMMIT;