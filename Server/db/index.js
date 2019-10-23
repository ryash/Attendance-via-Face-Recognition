const Pool = require('pg').Pool

const pool = new Pool({
  user: 'sysadmin',
  host: 'localhost',
  database: 'attendancerecord',
  password: '12345',
  port: 5432,
})

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  },
  client: pool
}