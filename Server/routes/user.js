const express = require("express");
const router = express.Router();
const { loginRequired, ensureCorrectUser } = require("../middlewares/auth");
const { getUserAttendance, getUserCourses } = require("../handlers/user");

router.get("/:userId", loginRequired, ensureCorrectUser, getUserCourses);
router.get("/:userId/:courseId", loginRequired, ensureCorrectUser, getUserAttendance);

module.exports = router;