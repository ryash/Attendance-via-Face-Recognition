PATH TO SQL FILE: /home/tenebris/Study/LAP/Server/db

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

psql -d attendancerecord -U sysadmin -a -f '/home/tenebris/Study/LAP/Server/db/Queries.sql'

TODOS:

ADD CASCADE DELETE;

TESTS: 

FACULTY: 

http POST http://localhost:8081/api/auth/signup/faculty name=Aniket password=aniket email=aniket@iitmandi.ac.in
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAxYmQ5ZjFlLWJmZDctNGZmOC1iMWQ4LTEyZGM2YWQ3MDRlYiIsIm5hbWUiOiJBbmlrZXQiLCJlbWFpbCI6ImFuaWtldEBpaXRtYW5kaS5hYy5pbiIsImlzQWRtaW4iOnRydWUsImlhdCI6MTU3MjM0MTY0N30.BIQOpJSSNRMotBS6fOYQWtvJx3QeF5Sve0roMYJkbsQ"
"id": "01bd9f1e-bfd7-4ff8-b1d8-12dc6ad704eb"

http POST http://localhost:8081/api/auth/signup/faculty name=Atyant password=atyant email=atyant@iitmandi.ac.in
"id": "6eebe84a-82bf-452f-b75c-9031cc908551"
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZlZWJlODRhLTgyYmYtNDUyZi1iNzVjLTkwMzFjYzkwODU1MSIsIm5hbWUiOiJBdHlhbnQiLCJlbWFpbCI6ImF0eWFudEBpaXRtYW5kaS5hYy5pbiIsImlzQWRtaW4iOnRydWUsImlhdCI6MTU3MjM0MTc1Mn0.ObyR2TzwGOwLXlnBb9sDFSMO2Rtz29_temVJLoQvxng"

STUDENTS:

http POST http://localhost:8081/api/auth/signup/student name=Arpit password=arpit email=arpit@students.iitmandi.ac.in rollno=B17009
"id": "B17009"
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkIxNzAwOSIsIm5hbWUiOiJBcnBpdCIsImVtYWlsIjoiYXJwaXRAc3R1ZGVudHMuaWl0bWFuZGkuYWMuaW4iLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNTcyMzQxODQyfQ._dr-e0ly1CzzjmNn7tXJVj1NT_7wrl21JaraJ3r-eAU"

http POST http://localhost:8081/api/auth/signup/student name=Ankit password=ankit email=ankit@students.iitmandi.ac.in rollno=B17035
"id": "B17035"
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkIxNzAzNSIsIm5hbWUiOiJBbmtpdCIsImVtYWlsIjoiYW5raXRAc3R1ZGVudHMuaWl0bWFuZGkuYWMuaW4iLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNTcyMzQxOTA0fQ.XYZ-1W3BCgRPLyaw3Zs208UTTAvwx1MccGeiCcbmAqs"

DUMMY STUDENT:

http POST http://localhost:8081/api/auth/signup/student name=DUMMY password=dummy email=dummy@students.iitmandi.ac.in rollno=12DUMMY00
"id": "12DUMMY00"
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyRFVNTVkwMCIsIm5hbWUiOiJEVU1NWSIsImVtYWlsIjoiZHVtbXlAc3R1ZGVudHMuaWl0bWFuZGkuYWMuaW4iLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNTcyMzQ1NjI3fQ.C3xKgV30jfBRV5vDl4ku0q9LSuLNMq4fVCDefDhzvOU"


COURSE CREATE:

http POST http://localhost:8081/api/service/course/01bd9f1e-bfd7-4ff8-b1d8-12dc6ad704eb courseName=LAP courseId=CS310 attendanceCriteria=75 Authorization:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAxYmQ5ZjFlLWJmZDctNGZmOC1iMWQ4LTEyZGM2YWQ3MDRlYiIsIm5hbWUiOiJBbmlrZXQiLCJlbWFpbCI6ImFuaWtldEBpaXRtYW5kaS5hYy5pbiIsImlzQWRtaW4iOnRydWUsImlhdCI6MTU3MjM0MTY0N30.BIQOpJSSNRMotBS6fOYQWtvJx3QeF5Sve0roMYJkbsQ"

http POST http://localhost:8081/api/service/course/6eebe84a-82bf-452f-b75c-9031cc908551 courseName=ICDP courseId=CS567 Authorization:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZlZWJlODRhLTgyYmYtNDUyZi1iNzVjLTkwMzFjYzkwODU1MSIsIm5hbWUiOiJBdHlhbnQiLCJlbWFpbCI6ImF0eWFudEBpaXRtYW5kaS5hYy5pbiIsImlzQWRtaW4iOnRydWUsImlhdCI6MTU3MjM0MTc1Mn0.ObyR2TzwGOwLXlnBb9sDFSMO2Rtz29_temVJLoQvxng"

ATTENDACE MARK ONE:

http POST http://localhost:8081/api/service/6eebe84a-82bf-452f-b75c-9031cc908551/CS567/B17009 Authorization:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZlZWJlODRhLTgyYmYtNDUyZi1iNzVjLTkwMzFjYzkwODU1MSIsIm5hbWUiOiJBdHlhbnQiLCJlbWFpbCI6ImF0eWFudEBpaXRtYW5kaS5hYy5pbiIsImlzQWRtaW4iOnRydWUsImlhdCI6MT3MjM0MTc1Mn0.ObyR2TzwGOwLXlnBb9sDFSMO2Rtz29_temVJLoQvxng"

MARK ALL:

http POST http://localhost:8081/api/service/01bd9f1e-bfd7-4ff8-b1d8-12dc6ad704eb/CS310 rollNos:='["B17009", "B17035"]' Authorization:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAxYmQ5ZjFlLWJmZDctNGZmOC1iMWQ4LTEyZGM2YWQ3MDRlYiIsIm5hbWUiOiJBbmlrZXQiLCJlbWFpbCI6ImFuaWtldEBpaXRtYW5kaS5hYy5pbiIsImlzQWRtaW4iOnRydWUsImlhdCI6MTU3MjM0MTY0N30.BIQOpJSSNRMotBS6fOYQWtvJx3QeF5Sve0roMYJkbsQ"

GET ATTENDANCE ONE SIMPLE:

http GET http://localhost:8081/api/service/6eebe84a-82bf-452f-b75c-9031cc908551/CS567/B17009 Authorization:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZlZWJlODRhLTgyYmYtNDUyZi1iNzVjLTkwMzFjYzkwODU1MSIsIm5hbWUiOiJBdHlhbnQiLCJlbWFpbCI6ImF0eWFudEBpaXRtYW5kaS5hYy5pbiIsImlzQWRtaW4iOnRydWUsImlhdCI6MTU3MjM0MTc1Mn0.ObyR2TzwGOwLXlnBb9sDFSMO2Rtz29_temVJLoQvxng"

GET ATTENDANCE ONE DATE:

http GET "http://localhost:8081/api/service/6eebe84a-82bf-452f-b75c-9031cc908551/CS567/B17009?from=2019-10-14&to=2019-10-30" Authorization:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZlZWJlODRhLTgyYmYtNDUyZi1iNzVjLTkwMzFjYzkwODU1MSIsIm5hbWUiOiJBdHlhbnQiLCJlbWFpbCI6ImF0eWFudEBpaXRtYW5kaS5hYy5pbiIsImlzQWRtaW4iOnRydWUsImlhdCI6MTU3MjM0MTc1Mn0.ObyR2TzwGOwLXlnBb9sDFSMO2Rtz29_temVJLoQvxng"



insert into attendance(rollno, course_id, attenddate) values('B17009', 'CS567', '2019-10-28'), ('B17009', 'CS567', '2019-10-27'), ('B17009', 'CS567', '2019-10-26'), ('12DUMMY00', 'CS567', '2019-10-28'), ('12DUMMY00', 'CS567', '2019-10-27'), ('12DUMMY00', 'CS567', '2019-10-26');