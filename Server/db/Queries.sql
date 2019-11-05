CREATE TABLE facultyLogin (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name varchar(50) NOT NULL, email varchar(50) UNIQUE NOT NULL, password varchar(64) NOT NULL);

CREATE TABLE studentLogin (RollNo varchar(10) PRIMARY KEY, name varchar(50) NOT NULL, email varchar(50) UNIQUE NOT NULL, password varchar(64) NOT NULL, registered boolean DEFAULT false NOT NULL);

CREATE TABLE courses (course_id varchar(20) PRIMARY KEY, course_name varchar(50) NOT NULL, facultyId uuid REFERENCES facultyLogin(id) NOT NULL, Attendance_Criteria smallint);

CREATE TABLE attendance (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), RollNo varchar(10) REFERENCES studentLogin(RollNo) NOT NULL, course_id varchar(20) REFERENCES courses(course_id) NOT NULL, attendDate DATE NOT NULL, UNIQUE (RollNo, course_id, attendDate));


INSERT INTO facultyLogin(name, email, password) VALUES('god', 'god@god.com', '$2b$10$IVv2jQqdHqgq8TXZ7jeduuFMMEgUfn1lnAkSHeL1KcXb8QgXPTCZi');

-- "renu23#@14$", "$2b$10$IVv2jQqdHqgq8TXZ7jeduuFMMEgUfn1lnAkSHeL1KcXb8QgXPTCZi"
