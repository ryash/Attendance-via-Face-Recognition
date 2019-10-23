const express = require("express");
const router = express.Router();
const { loginRequired, ensureCorrectUser } = require("../middlewares/auth");
const { mark } = require("../handlers/service");

router.post("/:facultyId/:courseId/:rollNo", loginRequired, ensureCorrectUser, mark);

module.exports = router;