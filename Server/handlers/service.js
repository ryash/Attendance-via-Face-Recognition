const db = require("../db");

exports.markAttendance = function(req, res, next){
    
	try{
		let table = 'attendance';
		
		let attendDate = new Date();
		attendDate = `${attendDate.getFullYear()}-${attendDate.getMonth() + 1}-${attendDate.getDate()}`; 
		let rollNo = req.params.rollNo;
		let courseId = req.params.courseId;

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
	}
	catch(err){
		return next({
			status: 404,
			message: err.message
		});
	}
};

exports.markAttendanceAll = function(req, res, next){
    
	try{
		let table = 'attendance';
		
		let attendDate = new Date();
		attendDate = `${attendDate.getFullYear()}-${attendDate.getMonth() + 1}-${attendDate.getDate()}`; 
		let courseId = req.params.courseId;

		markDummyAttendance(courseId, next)
			.then(() => {
				let { rollNos } = req.body;
				let query = `INSERT INTO ${table}(rollno, course_id, attenddate) VALUES`;

				let values = [];
				for (let i = 0; i < rollNos.length; i++){
					let j = 3 * i; 
					if(i == rollNos.length - 1){
						query += `($${j + 1}, $${j+2}, $${j+3})`;
						values.push(rollNos[i]);
						values.push(courseId);
						values.push(attendDate);
						break;
					}
					query += `($${j + 1}, $${j+2}, $${j+3}),`;
					values.push(rollNos[i]);
					values.push(courseId);
					values.push(attendDate);
				}

				db.query(query, values)
					.then((result) => {
						let message = `Marked present`;
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
			})
			.catch(err => {
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
						RollNo: rollNo,
						CourseId: courseId,
						Date: k,
						Present: v
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

							return false;
						}
						else{
							return true;
						}
					});
					
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
								Present: v
							});
							classDates.set(k, false);
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