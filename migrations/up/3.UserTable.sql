START TRANSACTION;
  CREATE TABLE "user_table" (
      id serial PRIMARY KEY,
      fname varchar NOT NULL,
      lname varchar NOT NULL,
      email varchar NOT NULL unique,
      password varchar NOT NULL,
      photo varchar default 'https://bbbbk-photos.s3.eu-central-1.amazonaws.com/users/default_avatar',
      id_info integer,
      foreign key (id_info) references info_table(id)
  );
COMMIT;