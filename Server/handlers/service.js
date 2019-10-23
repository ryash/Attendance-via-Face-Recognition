const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const format = require("pg-format");

exports.mark = async function(req, res, next){
    
	try{
			let table = 'attendance';
            let {date} = req.body;
            let rollNo = req.params.rollNo;
			let courseId = req.params.courseId;
			
			const query = `INSERT INTO ${table}(rollno, course_id, attenddate) VALUES($1,$2,$3)`;
			const values = [rollNo, courseId, date];

			db.query(query, values)
				.then(async (result) => {
					let message = `${rollNo} has been marked present`;
					return res.status(200).json({
						message
					});
				})
				.catch(err => {
					if(err.code == 23505){
						return next({
							status: 404,
							message: `${rollNo} already marked present`
						});
					}
					console.log(err);
					return next({
						status: 404
						
					});
				});
	} catch(err){
		return next({
			status: 404,
			message: err.message
		});
	}
};