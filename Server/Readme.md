## Intoduction

The Server provides a Rest API, to fetch and post data, implemented in JavaScript using NodeJs and ExpressJS.
Endpoints are provided to signup, signin for student and faculty, register student to a course, mark his/her attendance, create course, set course attendance criteria, unregister a student from a course, get attendance of students in a course.

The endpoints are protected using JSON Web Tokens, and require AUTORIZATION header for accessing.

API manual provides details about all the Rest API endpoints.
For database we use PostgreSQL.
Instructions for setting up database and server are provided in Installation.txt

## Screenshots of database tables:

![Alt text](images/login.png?raw=true "Facultylogin and Studentlogin Tables")

![Alt text](images/attend.png?raw=true "Attendance and Courses Tables")