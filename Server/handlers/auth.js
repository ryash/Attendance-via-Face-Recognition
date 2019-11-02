const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
let tableRoles = ['facultyLogin','studentLogin'];

exports.signin = async function(req, res, next){
    
	try{
		if(req.params.role == 'faculty'){
			let table = tableRoles[0];
			let {email, password: pass} = req.body;
			if(!validateEmail(email)){
				throw Error("Invalid Email");
			}

			const query = `SELECT id, name, password FROM ${table} WHERE email=$1`;
			const values = [email];

			db.query(query, values)
				.then(async (result) => {
					if(result.rows[0]){
						let {id, name, password} = result.rows[0];
						let isMatch = await bcrypt.compare(pass, password);

						if(isMatch){
							let token = jwt.sign(
								{
									id,
									name,
									email,
									isAdmin: true
								},
								process.env.SECRET_KEY
								);
								return res.status(200).json({
									id,
									name,
									email,
									isAdmin: true,
									token
								});
						}
						else{
							return next({
								status: 400,
								message: "Invalid Email/Password."
							});
						}
					}else{
						return next({
							status: 400,
							message: "Invalid Email/Password."
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
		else if(req.params.role == 'student'){
			let table = tableRoles[1];
			let {rollNo, password: pass} = req.body;
			// if(!validateEmail(email)){
			// 	throw Error("Invalid Email");
			// }
			const query = `SELECT RollNo, email, name, password FROM ${table} WHERE rollno=$1`;
			const values = [rollNo];

			db.query(query, values)
				.then(async (result) => {
					if(result.rows[0]){
						let {RollNo, name, password, email} = result.rows[0];
						let isMatch = await bcrypt.compare(pass, password);

						if(isMatch){
							let token = jwt.sign(
								{
									id: RollNo,
									name,
									email,
									isAdmin: false
								},
								process.env.SECRET_KEY
								);
								return res.status(200).json({
									id: RollNo,
									name,
									email,
									token,
									isAdmin: false
								});
						}
						else{
							return next({
								status: 400,
								message: "Invalid RollNo/Password."
							});
						}
					}else{
						return next({
							status: 400,
							message: "Invalid RollNo/Password."
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
		else{
			throw new Error();
		}
	} catch(err){
		return next({
			status: 404,
			message: err.message
		});
	}
};

exports.signup = async function(req, res, next){

	try{
		if(req.params.role == 'faculty'){
			let table = tableRoles[0];
			let {name, email, password} = req.body;
			if(!validateEmail(email)){
				throw Error("Invalid Email");
			}
			let hashedPassword = await bcrypt.hash(password, 10);
			const query = `INSERT INTO ${table} (name, email, password) VALUES($1,$2,$3) RETURNING id`;
			const values = [name, email, hashedPassword];

			db.query(query, values)
				.then(result => {
					let id = result.rows[0].id;
					
					let token = jwt.sign(
					{
						id,
						name,
						email,
						isAdmin: true
					},
					process.env.SECRET_KEY
					);
					return res.status(200).json({
						id,
						name,
						email,
						token,
						isAdmin: true
					});
				})
				.catch(err => {
					if(err.code == 23505){
						err.message = "Sorry, that email is taken";		
					}
					return next({
						status: 404,
						message: err.message
					});
				});
		}	
		else if(req.params.role == 'student'){
			let table = tableRoles[1];
			let {rollNo, name, email, password} = req.body;
			if(!validateEmail(email)){
				throw Error("Invalid Email");
			}
			let hashedPassword = await bcrypt.hash(password, 10);
		
			const query = `INSERT INTO ${table} (rollno, name, email, password) VALUES($1,$2,$3,$4) RETURNING rollno`;
			const values = [rollNo, name, email, hashedPassword];
		
			db.query(query, values)
				.then(result => {
					let id = result.rows[0].rollno;
					let token = jwt.sign(
					{
						id,
						name,
						email,
						isAdmin: false
					},
					process.env.SECRET_KEY
					);
					return res.status(200).json({
						id,
						name,
						email,
						token,
						isAdmin: false
					});
				})
				.catch(err => {
					if(err.code == 23505){
						err.message = "Sorry, that email or rollNo is taken";		
					}
					return next({
						status: 404,
						message: err.message
					});
				});
		}
		else{
			throw new Error("YOU SEEM LOST!!!!!!!!");
		}
	} catch(err){
		return next({
			status: 404,
			message: err.message
		});
	}	
};


function validateEmail(sEmail) {
	var reEmail = /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/;
  
	if(!sEmail.match(reEmail)) {
	  return false;
	}
	return true;
}