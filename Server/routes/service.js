const express = require("express");
const router = express.Router();
const { loginRequired, ensureCorrectUser, ensureCorrectCourse } = require("../middlewares/auth");
const { markAttendance, markAttendanceAll, getAttendanceEnh, getAttendanceAllEnh } = require("../handlers/service");

router.post("/:facultyId/:courseId/:rollNo", loginRequired, ensureCorrectUser, ensureCorrectCourse, markAttendance);
router.post("/:facultyId/:courseId/", loginRequired, ensureCorrectUser, ensureCorrectCourse, markAttendanceAll);
router.get("/:facultyId/:courseId/:rollNo", loginRequired, ensureCorrectUser, ensureCorrectCourse, getAttendanceEnh);
router.get("/:facultyId/:courseId/", loginRequired, ensureCorrectUser, ensureCorrectCourse, getAttendanceAllEnh);


//getAttendance, getAttendanceAll, 
module.exports = router;