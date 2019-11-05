require('dotenv').config();
const express = require('express');
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const errorHandler = require("./handlers/error");
const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/course");
const serviceRoutes = require("./routes/service");
const registerRoutes = require("./routes/register");
const userRoutes = require("./routes/user");

/**
 * PORT on which the server will listen.
 */
const PORT = process.env.PORT || 8081;

app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));


/**
 * Endpoints of the api.
 */

/**
 * Authorization route for signup and signin functions.
 */
app.use("/api/auth", authRoutes);

/**
 * Route for faculty for registering students to course.
 */
app.use("/api/service/register", registerRoutes);

/**
 * Route for faculty for creating and getting courses.
 */
app.use("/api/service/course", courseRoutes);

/**
 * Route for faculty for marking and retreiving attendance of students.
 */
app.use("/api/service", serviceRoutes);

/**
 * Route for student to check his/her attendance.
 */
app.use("/api/user", userRoutes);


/**
 * Error handler for request on undefined routes.
 */
app.use(function(req, res, next){
	let err = new Error("Not Found");
	err.status = 404;
	next(err);
});

/**
 * Errorhandler to process and format errors and respond error to requestor. 
 */
app.use(errorHandler);

/**
 * Server starts listening on specifies port
 */
app.listen(PORT, function(){
	console.log(`Server Starting on port ${PORT}`);
});