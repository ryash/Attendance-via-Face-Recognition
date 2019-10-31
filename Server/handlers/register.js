const db = require("../db");

exports.registerStudent = function(req, res, next){
    
	try{
		let table = 'attendance';
		
		let attendDate = new Date('2011-01-01');
		attendDate = `${attendDate.getFullYear()}-${attendDate.getMonth() + 1}-${attendDate.getDate()}`; 
		let rollNo = req.params.rollNo;
		let courseId = req.params.courseId;

        const query = `INSERT INTO ${table}(rollno, course_id, attenddate) VALUES($1,$2,$3)`;
        const values = [rollNo, courseId, attendDate];

        db.query(query, values)
            .then((result) => {
                let message = `${rollNo} is registered`;
                return res.status(200).json({
                    message
                });
            })
            .catch(err => {
                if(err.code == 23505){
                    return next({
                        status: 404,
                        message: `${rollNo} already registered`
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

exports.registerAllStudent = function(req, res, next){
    
	try{
		let table = 'attendance';
		
		let attendDate = new Date('2011-01-01');
		attendDate = `${attendDate.getFullYear()}-${attendDate.getMonth() + 1}-${attendDate.getDate()}`; 
		let courseId = req.params.courseId;

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
                let message = `Registered`;
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