const db = require("../db");

exports.createCourse = function(req, res, next){
    
	try{
		let table = 'courses';
		let { courseName, courseId } = req.body;
		let attendanceCriteria = 70;
		if(req.body.hasOwnProperty('attendanceCriteria')){
			attendanceCriteria = req.body['attendanceCriteria'];
		}
		let facultyId = req.params.facultyId;
		
		const query = `INSERT INTO ${table}(course_id, course_name, facultyid, attendance_criteria) VALUES($1,$2,$3,$4)`;
		const values = [courseId, courseName, facultyId, attendanceCriteria];

		db.query(query, values)
			.then((result) => {
				let message = `${courseName} created.`;
				return res.status(200).json({
					message
				});
			})
			.catch(err => {
				if(err.code == 23505){
					return next({
						status: 404,
						message: `${courseName} already present`
					});
				}
				console.log(err);
				return next({
					status: 404
					
				});
			}); 
	}
	catch(err){
		return next({
			status: 404,
			message: err.message
		});
	}
};

exports.changeCriteria = function(req, res, next){
    
	try{
		let table = 'courses';
		let { newAttendanceCriteria, courseName } = req.body;
		let facultyId = req.params.facultyId;
		let courseId = req.params.facultyId;
		
		const query = `UPDATE ${table} SET attendance_criteria = $1 WHERE course_id = $2 AND facultyid = $3 AND course_name = $4`;
		const values = [newAttendanceCriteria, courseId, facultyId, courseName];

		db.query(query, values)
			.then((result) => {
				let message = `Attendance criteria updated.`;
				return res.status(200).json({
					message
				});
			})
			.catch(err => {
				console.log(err);
				return next({
					status: 404
					
				});
			}); 
	}
	catch(err){
		return next({
			status: 404,
			message: err.message
		});
	}
};

exports.getCourses = function(req, res, next){

	try{
		let table = 'courses';

		let facultyId = req.params.facultyId;
		
		const query = `SELECT * FROM ${table} WHERE facultyid=$1`;
		const values = [facultyId];

		db.query(query, values)
			.then((result) => {
				let rows = result.rows;
				let message = [];

				rows.forEach(elem => {
					let{ course_id: courseId, course_name: courseName , attendance_criteria: attendanceCriteria } = elem;
					message.push({
						courseId,
						courseName,
						attendanceCriteria
					});
				}); 						  

				return res.status(200).json({
					message
				});
			})
			.catch(err => {
				console.log(err);
				return next({
					status: 404
					
				});
			}); 
	}
	catch(err){
		return next({
			status: 404,
			message: err.message
		});
	}
};