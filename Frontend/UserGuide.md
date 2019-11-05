## User Manual:
* Startup Screen:
    * When the user opens the app, a screen is shown asking the user to enter their 'Server URL'. This is the url where the server is hosted. For our developmet purpose this url is http://{ip}:{port}(Note that their is no trailing '/' in domain). The users are asked to enter this url because this decouples the app from the domain where the server is hosted. Hence, any organization can use the same application without changing any source code with their own server hosted on some domain(or maybe on their local network).
    Once this domain is entered, the users are forwarded to the login/register screen.

* Login Screens:
    * Student Login Screen: This page is for the students to login.
        * Student need to have their roll no and password to login which they can get when they sign up.
    * Student Register Screen: This page is for the students to register.
        Student will need their roll no, email and name to register on the application. The password they choose here, along with their roll no will work as login credentials for the further use of the application.
    * Faculty Login Screen: This Page is for the faculties to login.
        * Faculties need their email and password to login. They will get these credentials from some other faculty who adds them as a faculty. We have used this design philosophy rather than directly creating a signup portal for students as this will allow creating some fake faculty accounts.

* User Screen:
    * This page is shown to the students when they log in to the application. Here they only have one feature available to them as of now, to see their attendance in any of their registered courses.
    * The 'My courses' button will open all the courses they have registered for. Clicking on any of the course name will open his/her attendance records in that course.

* Admin Screen:
    * This page is shown to the faculties when they log in to the application. They can see following buttons on their home page:
        * My Courses: Shows all the courses that the corresponding faculty teach. When the faculty clicks on this button, list of all his/her courses is shown. When faculty clicks on any of the items of this course list, a set of actions, which are applicable to all the courses, are shown. These actions are as follows:
            * Take Attendance: Clicking on this button will open a page asking the user to enter the roll no. of the student, he wants to mark the attendance for. After this step, the camera is opened to take the picture of the student with that roll no. This picture is then sent to the server, verified, marked present and then a response is sent back stating that the student is marked present successfully. In case of any error(i.e. face not recognized etc.), corresponding error is sent back by the server.
            * See Attendance: When the faculty clicks on this button, the overview of the attendance of every student enrolled in the corresponding course is shown to him. When the faculty clicks on any of these rows, he is shown the full attendance record of the corresponding student. 
            * Add Student: This button is to add a student in the relevant course. This action is to be taken by faculty as this requires the student to upload his photo. If this action is permitted to the student, he may send the photo of someone/something else which is apparently not desirable. Faculty needs to give the roll no and at least three images(to better train the model) of the student to proceed.
        * Add New Course: Allows the faculty to add a new course that he/she might be teaching. The page opened after clicking this button asks the faculty for the code and name of the course that he/she is teaching. This assumes that "all courses have a code". For the institutions to which this doesn't apply, can provide some dummy unique id as course code.
        * Add New Faculty: This allows the current faculty to add a new faculty who is currently not enrolled in the application. This philosophy assumes that their is a "root faculty". This root faculty will be manually added in the database by the admin of the database where the server is hosted. Now this root faculty can add other faculties who can further add other faculties recursively. The credentials required to register a new faculty are just the name and email of the faculty. After registering the faculty, the faculty will be given his/her email, password as login credentials.