CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE facultyLogin (id uuid PRIMARY KEY DEFAULT gen_random_uuid(),name varchar(50) NOT NULL,email varchar(50) UNIQUE NOT NULL, password varchar(64) NOT NULL);

CREATE TABLE studentsLogin (RollNo varchar(10) PRIMARY KEY,name varchar(50) NOT NULL,email varchar(50) UNIQUE NOT NULL,password varchar(64) NOT NULL);

CREATE TABLE faculty (id uuid PRIMARY KEY DEFAULT gen_random_uuid(),name varchar(50) NOT NULL,course varchar(10),AttenCrit smallint);

CREATE TABLE cs111 (RollNo varchar(10) PRIMARY KEY REFERENCES studentsLogin(RollNo), name varchar(50) NOT NULL, attendDate DATE[]);
