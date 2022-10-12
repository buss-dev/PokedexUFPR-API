/* Replace with your SQL commands */
CREATE TABLE account (
    account_id INT PRIMARY KEY,
    account_number INT NOT NULL,
    account_agency INT NOT NULL,
    account_owner INT NOT NULL REFERENCES person(person_id),
    account_type INT DEFAULT 1 REFERENCES account_type(account_type_id)
);