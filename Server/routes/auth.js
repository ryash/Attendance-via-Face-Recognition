const express = require("express");
const router = express.Router();
const { signup, signin } = require("../handlers/auth");

router.post("/signup/:role", signup);
router.post("/signin/:role", signin);

module.exports = router;