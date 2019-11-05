const db = require("../db");
const base64Img = require("base64-img");
const {PythonShell} = require('python-shell');

/**
 * Function to mark attendance of a student in a course on the requesting day.
 * 
 * 
 * It accepts an image of a student in base64 string format.
 * It saves the image in the model's folder then runs the model to match if the image is associated
 * with the rollNo it is sent for, if matched attendance is marked else error code is returned.
 * 
 * It also checks if the rollNo is registered in the course
 * 
 */
exports.markAttendance = function(req, res, next){

	try{
		let table = 'attendance';
		
		let attendDate = new Date();
		attendDate = `${attendDate.getFullYear()}-${attendDate.getMonth() + 1}-${attendDate.getDate()}`; 
		let rollNo = req.params.rollNo;
		let courseId = req.params.courseId;

		let { image } = req.body;

		if(!saveImgToFolder(image, `${rollNo}`)){
			return next({
				status: 404
				
			});
		}

		//run model and mark attendance

		var options = {
            mode: 'text',
            pythonPath: '/usr/bin/python3',
            pythonOptions: ['-u'],
            scriptPath: `${__dirname}/../model`,
            args: [],
            cwd: `${__dirname}/../model/`
        };

        PythonShell.run('face-recognition.py', options, function (err, results) {
            if (err){ 
                console.log(err);
                throw err;
            }
            // Results is an array consisting of messages collected during execution
			console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@results: ', results);

			let rnum = '';
			if(results.length > 0 && results[0] != 'None'){
				rnum = elem.substring(0, 6); 
			}

			if(rnum == '' || rnum != rollNo){
				console.log("COULD NOT MARK");
				return next({
					status: 404,
					message: 'Student not recognized'
				});
			}
			
			checkIfRegistered(courseId, rollNo)
				.then(() => {
					markDummyAttendance(courseId, next)
					.then(() => {
						const query = `INSERT INTO ${table}(rollno, course_id, attenddate) VALUES($1,$2,$3)`;
						const values = [rollNo, courseId, attendDate];
		
						db.query(query, values)
							.then((result) => {
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
					})
					.catch(err => {
						return next({
							status: 404
		
						});
					});
				})
				.catch(err => {
					return next({
						status: 404,
						message: `${rollNo} not registered`
					});
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

/**
 * Function to save images of student in images folder for model to train on it.
 * 
 * It accepts base64 string of the image and converts it to image format and saves it in images folder
 */
function saveImgToFolder(base64Url, fileName) {
    let flag = true;
    base64Img.img(base64Url, __dirname + '/../model/Attend_Images', fileName, (err, filepath) => {
        if(err){
            flag = false;
        }
    });
    return flag;
}

/**
 * Function to mark attendance of multiple students in a course on the requesting day.
 * 
 * 
 * It accepts an images of the students in base64 string format.
 * It saves the image in the model's folder then runs the model to match if the image is associated
 * with the rollNo it is sent for, if matched attendance is marked else error code is returned.
 * 
 * It also checks if the rollNo is registered in the course
 * 
 */
// exports.markAttendanceAll = function(req, res, next){

// 	try{
// 		let table = 'attendance';
		
// 		let attendDate = new Date();
// 		attendDate = `${attendDate.getFullYear()}-${attendDate.getMonth() + 1}-${attendDate.getDate()}`; 
// 		let courseId = req.params.courseId;

// 		//Run the model and check attendance

// 		markDummyAttendance(courseId, next)
// 			.then(() => {
// 				let { rollNos } = req.body;
// 				let query = `INSERT INTO ${table}(rollno, course_id, attenddate) VALUES`;

// 				let values = [];
// 				for (let i = 0; i < rollNos.length; i++){
// 					let j = 3 * i; 
// 					if(i == rollNos.length - 1){
// 						query += `($${j + 1}, $${j+2}, $${j+3})`;
// 						values.push(rollNos[i]);
// 						values.push(courseId);
// 						values.push(attendDate);
// 						break;
// 					}
// 					query += `($${j + 1}, $${j+2}, $${j+3}),`;
// 					values.push(rollNos[i]);
// 					values.push(courseId);
// 					values.push(attendDate);
// 				}

// 				db.query(query, values)
// 					.then((result) => {
// 						let message = `Marked present`;
// 						return res.status(200).json({
// 							message
// 						});
// 					})
// 					.catch(err => {
// 						console.log(err);
// 						return next({
// 							status: 404
							
// 						});
// 					});
// 			})
// 			.catch(err => {
// 				return next({
// 					status: 404

// 				});
// 			});

// 	}
// 	catch(err){
// 		return next({
// 			status: 404,
// 			message: err.message
// 		});
// 	}
// };

/**
 * Function that runs the query on database to check if the rollNo is registered in the course
 */
function checkIfRegistered(courseId, rollNo){
	try{
		let table = 'attendance';
		
		let attendDate = new Date('2011-01-01');
		attendDate = `${attendDate.getFullYear()}-${attendDate.getMonth() + 1}-${attendDate.getDate()}`;
		
		const query = `SELECT * FROM ${table} WHERE rollno=$1 AND course_id=$2 AND attenddate=$3`;
		const values = [rollNo, courseId, attendDate];

		return db.query(query, values)
			.then((result) => {
				if(result.rowCount == 1){
					return Promise.resolve();
				}
				else{
					return Promise.reject();
				}
			})
			.catch(err => {
					return Promise.reject();
			});
	}
	catch(err){
		return next({
			status: 404,
			message: err.message
		});
	}
}

/**
 * It marks the a dummy attedance to keep track of the dates on which
 * class for the course took place to provide attendance details about a student
 */
function markDummyAttendance(courseId, next){
	try{
		let table = 'attendance';
		
		let attendDate = new Date();
		attendDate = `${attendDate.getFullYear()}-${attendDate.getMonth() + 1}-${attendDate.getDate()}`; 
		let rollNo = '12DUMMY00';
		
		const query = `INSERT INTO ${table}(rollno, course_id, attenddate) VALUES($1,$2,$3)`;
		const values = [rollNo, courseId, attendDate];

		return db.query(query, values)
			.then((result) => {
				return Promise.resolve();
			})
			.catch(err => {
				if(err.code != 23505){
					return Promise.reject();
				}
				else{
					return Promise.resolve();
				}
			});
	}
	catch(err){
		return next({
			status: 404,
			message: err.message
		});
	}
};

/**
 * Function returns the attendance of a student in the course having courseId.
 * 
 * The optional query params:
 * 	a). perc : if true, returns the percentage of the student in the course
 * 
 * 	b). from & to : specifies the range of date in which to check the attendance of the student 
 * 
 * 	It take helps of dummy attendance to get record of all the dates that classes have been taken.
 */
exports.getAttendanceEnh = function(req, res, next){
    
	try{
		let table = 'attendance';
		
		let getDateTo = '';
		let getDateFrom = '';
		let perc = false;

		if(req.query.hasOwnProperty('perc')){
			perc = req.query['perc'];
		}

		if(req.query.hasOwnProperty('from') && req.query.hasOwnProperty('to')){
			getDateFrom = new Date(req.query['from']);
			getDateTo = new Date(req.query['to']);
		}
 
		let rollNo = req.params.rollNo;
		let courseId = req.params.courseId;

		let query = `SELECT * FROM ${table} WHERE (rollno = $1 or rollno = '12DUMMY00') AND course_id = $2`;
		let values = [rollNo, courseId];

		if(getDateFrom != '' && getDateTo != ''){
			query += `AND ('["${getDateFrom.getFullYear()}-${getDateFrom.getMonth() + 1}-${getDateFrom.getDate()}", "${getDateTo.getFullYear()}-${getDateTo.getMonth() + 1}-${getDateTo.getDate()}"]'::daterange @> attenddate OR attenddate='2011-01-01')`;
		}

		let totalDays = 0, daysAttended = 0;
		
		db.query(query, values)
			.then((result) => {
				let rows = result.rows;
				let message = [];
				let classDates = new Map();
				let regFlag = false;
				
				let arr = rows.filter(element => {
					let {  rollno, attenddate } = element
					if(rollno == '12DUMMY00'){
						attenddate.setDate(attenddate.getDate() + 1); //INCREMENT DATE BY ONE
						let dt = attenddate.toISOString().split('T')[0];
						classDates.set(dt, false);
						totalDays = totalDays + 1;
						return false;
					}
					return true;
				});

				arr.forEach(elem => {
					let { rollno, attenddate } = elem;
					if(rollno === rollNo){
						attenddate.setDate(attenddate.getDate() + 1); //INCREMENT DATE BY ONE
						let cmp = new Date('2011-01-01');
						
						attenddate = attenddate.toISOString().split('T')[0].toString();
						cmp =  cmp.toISOString().split('T')[0].toString();
						if(attenddate !== cmp){
							let dt2 = attenddate;
							classDates.set(dt2, true);
							daysAttended = daysAttended + 1;
						}
						else{
							regFlag = true;
						}
					}
				});

				if(!regFlag){
					return next({
						status: 404,
						message: `${rollNo} not registered`
					});
				}

				for (const [k, v] of classDates) {
					message.push({
						Date: k,
						Present: v ? 'P' : 'A'
					});
				}  	
				
				if(perc){
					return res.status(200).json({
						RollNo: rollNo,
						percentage: ( daysAttended / totalDays ) * 100,
						totalDays,
						daysAttended
					});
				}
				else{
					return res.status(200).json({
						message
					});
				}
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

/**
 * Function returns the attendance of all student in the course having courseId.
 * 
 * The optional query params:
 * 	a). perc : if true, returns the percentage of the student in the course
 * 
 * 	b). from & to : specifies the range of date in which to check the attendance of the student 
 * 
 * 	It take helps of dummy attendance to get record of all the dates that classes have been taken.
 */
exports.getAttendanceAllEnh = function(req, res, next){
	try{
		let table = 'attendance';
		
		let getDateTo = '';
		let getDateFrom = '';
		let perc = false;

		if(req.query.hasOwnProperty('perc')){
			perc = req.query['perc'];
		}

		if(req.query.hasOwnProperty('from') && req.query.hasOwnProperty('to')){
			getDateFrom = new Date(req.query['from']);
			getDateTo = new Date(req.query['to']);
		}
 
		let courseId = req.params.courseId;

		let query = `SELECT * FROM ${table} WHERE course_id = $1`;
		let values = [courseId];

		if(getDateFrom != '' && getDateTo != ''){
			query += `AND ('["${getDateFrom.getFullYear()}-${getDateFrom.getMonth() + 1}-${getDateFrom.getDate()}", "${getDateTo.getFullYear()}-${getDateTo.getMonth() + 1}-${getDateTo.getDate()}"]'::daterange @> attenddate OR attenddate='2011-01-01')`;
		}
		
		db.query(query, values)
			.then((result) => {
				let rows = result.rows;
				let message = [];
				let classDates = new Map();
				let rNUMS = new Set();

				let totalDays = 0, daysAttended = 0;
				
				let arr = rows.filter(element => {
					let {  rollno, attenddate } = element;
					if(rollno == '12DUMMY00'){
						totalDays = totalDays + 1;
						attenddate.setDate(attenddate.getDate() + 1); //INCREMENT DATE BY ONE
						let dt = attenddate.toISOString().split('T')[0];
						classDates.set(dt, false);
						return false;
					}
					else{
						rNUMS.add(rollno);
						return true;
					}
				});
				
				rNUMS.forEach(rn => {
					let enrolled = false;
					daysAttended = 0;

					arr = arr.filter(elemen => {
						let { rollno, attenddate } = elemen;
						if(rollno === rn){
							attenddate.setDate(attenddate.getDate() + 1); //INCREMENT DATE BY ONE
							let cmp = new Date('2011-01-01');
							
							attenddate = attenddate.toISOString().split('T')[0].toString();
							cmp =  cmp.toISOString().split('T')[0].toString();
							if(attenddate !== cmp){
								classDates.set(attenddate, true);

								daysAttended = daysAttended + 1;
							}
							else{
								enrolled = true;
							}

							return false;
						}
						else{
							return true;
						}
					});

					if(enrolled) {
						if(perc){
							message.push({
								rollNo: rn,
								percentage: ( daysAttended / totalDays ) * 100,
								totalDays,
								daysAttended
							});
						}
						else{
							for (const [k, v] of classDates) {
								message.push({
									RollNo: rn,
									CourseId: courseId,
									Date: k,
									Present: v ? 'P' : 'A'
								});
								classDates.set(k, false);
							}
						}
					}
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