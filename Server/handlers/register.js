const db = require("../db");
const base64Img = require('base64-img');
const {PythonShell} = require('python-shell');

/**
 * Function to register students in a course.
 * 
 * It does so by giving the students a dummy attendance of date '2011-01-01'
 * 
 * It accepts a studentData json array consiting of rollno and images of students.
 * It saves the images of students in the models folder then runs the model to train it on student images.
 * 
 */
exports.registerAllStudent = function(req, res, next){
	try{
		let table = 'attendance';
		
		let attendDate = new Date('2011-01-01');
		attendDate = `${attendDate.getFullYear()}-${attendDate.getMonth() + 1}-${attendDate.getDate()}`; 
		let courseId = req.params.courseId;

        let { studentData } = req.body;

        let rollNos = [];

        let flag = false;

        studentData.map((elem, ind) => {
            rollNos.push(elem.rollNo);

            elem.images.map((img, ind) => {
                if(!saveImgToFolder(img, `${elem.rollNo}_${ind + 1}`)){
                    flag = true;
                }
            });
        });

        if(flag){
            return next({
                status: 404
            });
        }

        var options = {
            mode: 'text',
            pythonPath: '/usr/bin/python3',
            pythonOptions: ['-u'],
            scriptPath: `${__dirname}/../model`,
            args: [],
            cwd: `${__dirname}/../model/`
        };

        PythonShell.run('create_embeddings.py', options, function (err, results) {
            if (err){ 
                console.log(err);
                throw err;
            }
            // Results is an array consisting of messages collected during execution
            // console.log('results: ', results);

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
    base64Img.img(base64Url, __dirname + '/../model/images', fileName, (err, filepath) => {
        if(err){
            flag = false;
        }
    });
    return flag;
}

/**
 * Function to deregister a student from a course.
 * 
 * It does so by deleting the dummy attendance of the student from attendance table in database
 */
exports.deRegisterStudent = function(req, res, next){

    try{
        let table = 'attendance';
        
        let attendDate = new Date('2011-01-01');
        attendDate = `${attendDate.getFullYear()}-${attendDate.getMonth() + 1}-${attendDate.getDate()}`; 
        let rollNo = req.params.rollNo;
        let courseId = req.params.courseId;

        const query = `DELETE FROM ${table} WHERE rollno=$1 AND course_id=$2 AND attenddate=$3`;
        const values = [rollNo, courseId, attendDate];

        db.query(query, values)
            .then((result) => {
                let message = `${rollNo} is Unregistered`;
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