/* Replace with your SQL commands */
CREATE TABLE person (
    person_id SERIAL PRIMARY KEY,
    person_first_name varchar NOT NULL,
    person_last_name varchar NOT NULL,
    person_email varchar NOT NULL,
    person_password varchar NOT NULL
);