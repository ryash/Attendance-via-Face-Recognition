const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
let roles = ['faculty','student'];
let tableRoles = ['facultyLogin','studentsLogin'];
const format = require("pg-format");

exports.signin = async function(req, res, next){
    
	try{
		let table = req.params.role;
		if(roles.includes(table) || table == "users"){
			let {email, password: pass} = req.body;
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
									email
								},
								process.env.SECRET_KEY
								);
								return res.status(200).json({
									id,
									name,
									email,
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
						email
					},
					process.env.SECRET_KEY
					);
					return res.status(200).json({
						id,
						name,
						email,
						token
					});
				})
				.catch(err => {
					console.log(err);
					if(err.code == 23505){
						err.message = "Sorry, that email is taken";		
					}
					return next({
						status: 404,
						message: err.message
					});
				});
		}	
		else if(req.params.role == 'faculty'){
			let table = tableRoles[1];
			let {rollNo, name, email, password} = req.body;
			let hashedPassword = await bcrypt.hash(password, 10);
		
			const query = `INSERT INTO ${table} (rollNo, name, email, password) VALUES($1,$2,$3,$4) RETURNING id`;
			const values = [rollNo, name, email, hashedPassword];
		
			db.query(query, values)
				.then(result => {
					let id = result.rows[0].id;
					let token = jwt.sign(
					{
						id,
						name,
						email
					},
					process.env.SECRET_KEY
					);
					return res.status(200).json({
						id,
						name,
						email,
						token
					});
				})
				.catch(err => {
					console.log(err);
					if(err.code == 23505){
						err.message = "Sorry, that email is taken";		
					}
					return next({
						status: 404,
						message: err.message
					});
				});
		}
		else{
			throw new Error();
		}
	} catch(err){
		return next({
			status: 404
		});
	}	
};