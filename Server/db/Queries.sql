CREATE TABLE facultyLogin (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name varchar(50) NOT NULL, email varchar(50) UNIQUE NOT NULL, password varchar(64) NOT NULL);

CREATE TABLE studentLogin (RollNo varchar(10) PRIMARY KEY, name varchar(50) NOT NULL, email varchar(50) UNIQUE NOT NULL, password varchar(64) NOT NULL);

CREATE TABLE courses (course_id varchar(20) PRIMARY KEY, course_name varchar(50) NOT NULL, facultyId uuid REFERENCES facultyLogin(id) NOT NULL, Attendance_Criteria smallint);

CREATE TABLE attendance (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), RollNo varchar(10) REFERENCES studentLogin(RollNo), course_id varchar(20) REFERENCES courses(course_id), attendDate DATE, UNIQUE (RollNo, course_id, attendDate));
