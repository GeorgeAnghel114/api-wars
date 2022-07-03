create table users
(
    id       serial
        constraint users_pk
            primary key,
    username varchar,
    password varchar
);


