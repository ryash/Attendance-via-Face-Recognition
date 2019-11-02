// require("dotenv").load();
const jwt = require("jsonwebtoken");
const db = require("../db");


/**
 * Function(middleware) to check if the requesting user is logged in.
 * 
 * Token in the Authorization header is used to verify.
 */
exports.loginRequired = function(req, res, next) {
	try{
		const token = req.headers.authorization.split(" ")[1];
		jwt.verify(token, process.env.SECRET_KEY, function(err, decoded){
			if(decoded){
				return next();
			} else{
				return next({
					status: 401,
					message: "Please log in first"
				});
			}
		})
	} catch(e){
		return next({
			status: 401,
			message: "Please log in first"
		});
	}
};

/**
 * Function(middleware) to check if the requesting user is authorized to request the service.
 * 
 * Token in the Authorization header is used to verify
 *  and 
 * decoded id must match the id in the url.
 */
exports.ensureCorrectUser = function(req, res, next) {
	try {
		const token = req.headers.authorization.split(" ")[1];
		let id;
		if(req.params.hasOwnProperty('userId')){
			id = req.params['userId'];
		}
		else if(req.params.hasOwnProperty('facultyId')){
			id = req.params['facultyId'];
		}
		else{
			return next({
				status: 404,
				message: "NOT FOUND! Unauthorized Other"
			});
		}
		jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
			if(decoded && decoded.id === id) {
				return next();
			} else{
				return next({
					status: 401,
					message: "Unauthorized"
				});
			}
		});
	} catch(e){
		return next({
			status: 401,
			message: "Unauthorized"
		});
	}
};

/**
 * Function(middleware) to check if the requesting user is authorized to query for a particular course.
 * 
 * It runs query on the database to check.
 */
exports.ensureCorrectCourse = function(req, res, next) {
	try{
		let table = 'courses';

		let courseId = req.params.courseId;
		let facultyId = req.params.facultyId;
		
		const query = `SELECT * FROM ${table} WHERE course_id=$1 AND facultyid=$2`;
		const values = [courseId, facultyId];

		db.query(query, values)
			.then((result) => {
				if(result.rowCount == 0){
					return next({
						status: 401,
						message: "Unauthorized"
					});
				}
				return next();
			})
			.catch(err => {
				console.log(err);
				return next({
					status: 401,
					message: "Unauthorized"
				});
			});
	}
	catch(e){
		return next({
			status: 401,
			message: "Unauthorized"
		});
	}
};