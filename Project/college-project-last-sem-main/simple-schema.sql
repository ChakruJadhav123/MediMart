CREATE DATABASE IF NOT EXISTS medimart_db;
USE medimart_db;

CREATE TABLE IF NOT EXISTS admin (
  a_id INT AUTO_INCREMENT PRIMARY KEY,
  a_fullname VARCHAR(30) NOT NULL,
  a_login_id VARCHAR(10) UNIQUE NOT NULL,
  a_password VARCHAR(255) NOT NULL,
  a_contact VARCHAR(10),
  a_email VARCHAR(30) UNIQUE,
  a_address VARCHAR(50),
  a_gender VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS customer (
  c_id INT AUTO_INCREMENT PRIMARY KEY,
  c_fullname VARCHAR(30) NOT NULL,
  c_login_id VARCHAR(10) UNIQUE NOT NULL,
  c_password VARCHAR(255) NOT NULL,
  c_contact VARCHAR(10),
  c_email VARCHAR(30) UNIQUE,
  c_address VARCHAR(50),
  c_gender VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS medicine (
  m_id INT AUTO_INCREMENT PRIMARY KEY,
  m_name VARCHAR(20) NOT NULL,
  m_image VARCHAR(60),
  m_price INT NOT NULL,
  m_unit INT,
  m_category VARCHAR(15)
);

CREATE TABLE IF NOT EXISTS orders (
  o_id INT AUTO_INCREMENT PRIMARY KEY,
  o_date DATE NOT NULL,
  o_address VARCHAR(50) NOT NULL,
  o_status VARCHAR(10) DEFAULT 'PENDING',
  o_amt INT NOT NULL,
  c_id INT NOT NULL,
  FOREIGN KEY (c_id) REFERENCES customer(c_id)
);

CREATE TABLE IF NOT EXISTS payment (
  p_id INT AUTO_INCREMENT PRIMARY KEY,
  p_method VARCHAR(20) NOT NULL,
  p_date DATE NOT NULL,
  p_amount INT NOT NULL,
  p_status VARCHAR(10) DEFAULT 'PENDING',
  o_id INT UNIQUE NOT NULL,
  FOREIGN KEY (o_id) REFERENCES orders(o_id)
);

CREATE TABLE IF NOT EXISTS chatbot (
  chat_id INT AUTO_INCREMENT PRIMARY KEY,
  c_id INT,
  question VARCHAR(50) NOT NULL,
  response VARCHAR(50) NOT NULL,
  FOREIGN KEY (c_id) REFERENCES customer(c_id)
);
