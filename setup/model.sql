CREATE DATABASE magazin;
CREATE EXTENSION pgcrypto;

DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users(
    user_id BIGSERIAL NOT NULL PRIMARY KEY,
    user_first_name VARCHAR(32) NOT NULL,
    user_last_name VARCHAR(32) NOT NULL,
    email VARCHAR(32) NOT NULL,
    password VARCHAR(128) NOT NULL,
    confirm_password VARCHAR(128) NOT NULL,
    avatar VARCHAR(500)
);  

DROP TABLE IF EXISTS admins CASCADE;
CREATE TABLE admins(
    admin_id BIGSERIAL NOT NULL PRIMARY KEY,
    admin_username VARCHAR(32) NOT NULL,
    admin_password VARCHAR(128) NOT NULL,
    admin_confirm_password VARCHAR(128) NOT NULL
);