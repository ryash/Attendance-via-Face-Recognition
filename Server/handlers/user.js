const db = require("../db");

exports.getUserAttendance = function(req, res, next){
    
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
 
		let rollNo = req.params.userId;
		let courseId = req.params.courseId;

		let query = `SELECT * FROM ${table} WHERE (rollno = $1 or rollno = '12DUMMY00') AND course_id = $2`;
		let values = [rollNo, courseId];

		if(getDateFrom != ''  && getDateTo != ''){
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

exports.getUserCourses = function(req, res, next){
	try{
		let table = 'attendance';
 
		let rollno = req.params.userId;
		let date = '2011-01-01';

		let query = `SELECT attendance.course_id, courses.course_name FROM ${table} INNER JOIN courses on attendance.course_id = courses.course_id WHERE rollno=$1 and attenddate=$2`;
		let values = [rollno, date];
		
		db.query(query, values)
			.then((result) => {
				let rows = result.rows;
				let message = [];
				rows.forEach(element => {
					message.push({
						courseName: element.course_name,
						courseId: element.course_id
					})
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