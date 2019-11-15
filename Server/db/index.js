const Pool = require('pg').Pool

/**
 * Create a new object to connect to the database server.
 * 
 * Replace field to  connect it to your database server
 */
const pool = new Pool({
  user: 'sysadmin',
  host: 'localhost',
  database: 'attendancerecord',
  password: '12345',
  port: 5432,
})

/**
 * Export function to help in writing clean code to run database queries
 */
module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  },
  client: pool
}