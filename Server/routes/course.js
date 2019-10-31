const express = require("express");
const router = express.Router();
const { loginRequired, ensureCorrectUser } = require("../middlewares/auth");
const { createCourse, changeCriteria, getCourses } = require("../handlers/course");

router.post("/:facultyId", loginRequired, ensureCorrectUser, createCourse);
router.put("/:facultyId/:courseId", loginRequired, ensureCorrectUser, changeCriteria);
router.get("/:facultyId", loginRequired, ensureCorrectUser, getCourses);

module.exports = router;