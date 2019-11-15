const express = require("express");
const router = express.Router();
const { loginRequired, ensureCorrectUser } = require("../middlewares/auth");
const { getUserAttendance, getUserCourses } = require("../handlers/user");

/**
 * Get courses that the user(student) is registered in
 */
router.get("/:userId", loginRequired, ensureCorrectUser, getUserCourses);

/**
 * Get attendance of the user(student) in the course(courseId)
 */
router.get("/:userId/:courseId", loginRequired, ensureCorrectUser, getUserAttendance);

module.exports = router;