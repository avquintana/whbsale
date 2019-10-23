var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 100, //important
    host: process.env.DATABASE_SERVER,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    debug: false
});

const query = (sql, callback) => {
    pool.query(sql, callback);
}

module.exports = {
    query
}