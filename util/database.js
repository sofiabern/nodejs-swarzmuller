const mysql = require('mysql2')

const pool = mysql.createPool({
    host: 'localhost',
    user: "root",
    database: "practice",
    password: "soniab10022005"
})

module.exports = pool.promise()