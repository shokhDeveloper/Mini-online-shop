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
    admin_confirm_password VARCHAR(128) NOT NULL,
    admin_profile_image VARCHAR(500) 
);

DROP TABLE IF EXISTS categories CASCADE;
CREATE TABLE categories(
    category_id BIGSERIAL NOT NULL PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL
);

INSERT INTO categories (category_name) VALUES
('Telefonlar'),
('Kompyuter va ofis buyumlari'),
('Noutbuklar'),
('Geymerlar uchun'),
('Televizorlar'),
('Kiyimlar'),
('Oshxona buyumlari'),
('Kitoblar');

DROP TABLE IF EXISTS products CASCADE;
CREATE TABLE products(
    product_id INT generated always as identity primary key,
    product_name CHARACTER VARYING(32) NOT NULL,
    product_price decimal(20, 2) NOT NULL,
    product_image VARCHAR(500) NOT NULL,
    category_id INT references categories(category_id) NOT NULL,
    created_at TIMESTAMPTZ default current_timestamp 
);
-- INSERT INTO products (product_name, product_price, product_image, category_id) VALUES
-- ('Asus', 1200.00, 'asus.png', 2)
DROP TABLE IF EXISTS shops CASCADE;
CREATE TABLE shops(
    shop_id BIGSERIAL primary key NOT NULL,
    shop_user_id INT references users(user_id) NOT NULL,
    shop_product_id INT references products(product_id) NOT NULL,
    payment BOOLEAN default false NOT NULL
);

-- DROP TABLE IF EXISTS archive_purchase CASCADE;
-- CREATE TABLE archive_purchase{
--     archive_purchase_user_id INT references users (user_id) NOT NULL,
--     archive_purchase_product_id INT references products (product_id) NOT NULL,
-- }