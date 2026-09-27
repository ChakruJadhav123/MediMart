-- Oracle Database Schema for MediMart Application
-- Drop existing tables if they exist (with cascade)
BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE payment';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE ordered_medicine';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE orders';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE chatbot';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE medicine';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE customer';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE admin';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP SEQUENCE admin_seq';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP SEQUENCE customer_seq';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP SEQUENCE medicine_seq';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP SEQUENCE orders_seq';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP SEQUENCE payment_seq';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP SEQUENCE ordered_medicine_seq';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP SEQUENCE chatbot_seq';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

-- Create sequences for auto-increment
CREATE SEQUENCE admin_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE customer_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE medicine_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE orders_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE payment_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE ordered_medicine_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE chatbot_seq START WITH 1 INCREMENT BY 1;

-- Create Admin Table
CREATE TABLE admin (
    a_id NUMBER(10) PRIMARY KEY,
    a_fullname VARCHAR2(30) NOT NULL,
    a_login_id VARCHAR2(10) UNIQUE NOT NULL,
    a_password VARCHAR2(255) NOT NULL,
    a_contact VARCHAR2(10),
    a_email VARCHAR2(100) UNIQUE,
    a_address VARCHAR2(50),
    a_gender VARCHAR2(10),
    created_at TIMESTAMP DEFAULT SYSDATE,
    CONSTRAINT admin_email_check CHECK (a_email IS NULL OR a_email LIKE '%@%')
);

-- Create trigger for admin auto-increment
CREATE OR REPLACE TRIGGER admin_insert_trigger
BEFORE INSERT ON admin
FOR EACH ROW
BEGIN
    IF :NEW.a_id IS NULL THEN
        SELECT admin_seq.NEXTVAL INTO :NEW.a_id FROM DUAL;
    END IF;
END;
/

-- Create Customer Table
CREATE TABLE customer (
    c_id NUMBER(10) PRIMARY KEY,
    c_fullname VARCHAR2(30) NOT NULL,
    c_login_id VARCHAR2(10) UNIQUE NOT NULL,
    c_password VARCHAR2(255) NOT NULL,
    c_contact VARCHAR2(10),
    c_email VARCHAR2(100) UNIQUE,
    c_address VARCHAR2(50),
    c_gender VARCHAR2(10),
    created_at TIMESTAMP DEFAULT SYSDATE,
    CONSTRAINT customer_email_check CHECK (c_email IS NULL OR c_email LIKE '%@%')
);

-- Create trigger for customer auto-increment
CREATE OR REPLACE TRIGGER customer_insert_trigger
BEFORE INSERT ON customer
FOR EACH ROW
BEGIN
    IF :NEW.c_id IS NULL THEN
        SELECT customer_seq.NEXTVAL INTO :NEW.c_id FROM DUAL;
    END IF;
END;
/

-- Create Medicine Table
CREATE TABLE medicine (
    m_id NUMBER(10) PRIMARY KEY,
    m_name VARCHAR2(100) NOT NULL,
    m_image VARCHAR2(255),
    m_price NUMBER(10,2) NOT NULL,
    m_unit NUMBER(10),
    m_category VARCHAR2(50),
    m_description VARCHAR2(500),
    m_stock NUMBER(10) DEFAULT 0,
    created_at TIMESTAMP DEFAULT SYSDATE
);

-- Create trigger for medicine auto-increment
CREATE OR REPLACE TRIGGER medicine_insert_trigger
BEFORE INSERT ON medicine
FOR EACH ROW
BEGIN
    IF :NEW.m_id IS NULL THEN
        SELECT medicine_seq.NEXTVAL INTO :NEW.m_id FROM DUAL;
    END IF;
END;
/

-- Create Orders Table
CREATE TABLE orders (
    o_id NUMBER(10) PRIMARY KEY,
    o_date DATE NOT NULL,
    o_address VARCHAR2(100) NOT NULL,
    o_status VARCHAR2(20) DEFAULT 'PENDING',
    o_amt NUMBER(10,2) NOT NULL,
    c_id NUMBER(10) NOT NULL,
    created_at TIMESTAMP DEFAULT SYSDATE,
    FOREIGN KEY (c_id) REFERENCES customer(c_id) ON DELETE CASCADE
);

-- Create trigger for orders auto-increment
CREATE OR REPLACE TRIGGER orders_insert_trigger
BEFORE INSERT ON orders
FOR EACH ROW
BEGIN
    IF :NEW.o_id IS NULL THEN
        SELECT orders_seq.NEXTVAL INTO :NEW.o_id FROM DUAL;
    END IF;
END;
/

-- Create Ordered Medicine Table
CREATE TABLE ordered_medicine (
    om_id NUMBER(10) PRIMARY KEY,
    om_quantity NUMBER(10) NOT NULL,
    om_price NUMBER(10,2) NOT NULL,
    o_id NUMBER(10) NOT NULL,
    m_id NUMBER(10) NOT NULL,
    created_at TIMESTAMP DEFAULT SYSDATE,
    FOREIGN KEY (o_id) REFERENCES orders(o_id) ON DELETE CASCADE,
    FOREIGN KEY (m_id) REFERENCES medicine(m_id) ON DELETE CASCADE
);

-- Create trigger for ordered_medicine auto-increment
CREATE OR REPLACE TRIGGER ordered_medicine_insert_trigger
BEFORE INSERT ON ordered_medicine
FOR EACH ROW
BEGIN
    IF :NEW.om_id IS NULL THEN
        SELECT ordered_medicine_seq.NEXTVAL INTO :NEW.om_id FROM DUAL;
    END IF;
END;
/

-- Create Payment Table
CREATE TABLE payment (
    p_id NUMBER(10) PRIMARY KEY,
    p_method VARCHAR2(50) NOT NULL,
    p_date DATE NOT NULL,
    p_amount NUMBER(10,2) NOT NULL,
    p_status VARCHAR2(20) DEFAULT 'PENDING',
    p_transaction_id VARCHAR2(100),
    o_id NUMBER(10),
    created_at TIMESTAMP DEFAULT SYSDATE,
    FOREIGN KEY (o_id) REFERENCES orders(o_id) ON DELETE SET NULL
);

-- Create trigger for payment auto-increment
CREATE OR REPLACE TRIGGER payment_insert_trigger
BEFORE INSERT ON payment
FOR EACH ROW
BEGIN
    IF :NEW.p_id IS NULL THEN
        SELECT payment_seq.NEXTVAL INTO :NEW.p_id FROM DUAL;
    END IF;
END;
/

-- Create Chatbot Table
CREATE TABLE chatbot (
    chat_id NUMBER(10) PRIMARY KEY,
    chat_query VARCHAR2(1000) NOT NULL,
    chat_response VARCHAR2(2000),
    c_id NUMBER(10),
    created_at TIMESTAMP DEFAULT SYSDATE,
    FOREIGN KEY (c_id) REFERENCES customer(c_id) ON DELETE SET NULL
);

-- Create trigger for chatbot auto-increment
CREATE OR REPLACE TRIGGER chatbot_insert_trigger
BEFORE INSERT ON chatbot
FOR EACH ROW
BEGIN
    IF :NEW.chat_id IS NULL THEN
        SELECT chatbot_seq.NEXTVAL INTO :NEW.chat_id FROM DUAL;
    END IF;
END;
/

-- Insert sample admin
INSERT INTO admin (a_fullname, a_login_id, a_password, a_contact, a_email, a_address, a_gender)
VALUES ('Admin User', 'admin', '$2a$10$ZIv3V7GxvYN6SjF5U5vNcehzXw9F3Z5NZ5NZ5NZ5NZ5NZ5NZ', '9999999999', 'admin@medimart.com', 'Admin Address', 'Male');

COMMIT;
