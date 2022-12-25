/* Replace with your SQL commands */
CREATE TABLE account_type (
    account_type_id SERIAL PRIMARY KEY,
    account_type_name varchar NOT NULL
);

INSERT INTO account_type (account_type_name) VALUES ('Conta Basic');

INSERT INTO account_type (account_type_name) VALUES ('Conta Gold');

INSERT INTO account_type (account_type_name) VALUES ('Conta Platinum');

INSERT INTO account_type (account_type_name) VALUES ('Conta Black');