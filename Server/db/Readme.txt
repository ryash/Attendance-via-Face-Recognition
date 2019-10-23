PATH TO SQL FILE: /home/tenebris/Study/LAP/Server/db

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

psql -d attendancerecord -U sysadmin -a -f '/home/tenebris/Study/LAP/Server/db/Queries.sql'

TODOS:

ADD CASCADE DELETE;



http POST http://localhost:8081/api/auth/signup/student name=Aniket rollno=B17076 password=dsbjd email=b17076@students.iitmandi.ac.in