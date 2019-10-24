var mysql = require('mysql');
var dotenv = require('dotenv');

dotenv.config();

var pool = mysql.createPool({
    connectionLimit: 100, //important
    host: process.env.DATABASE_SERVER,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    debug: false
});

const query = (sql, callback) => {
    console.log('SQL', sql);
    pool.query(sql, callback);
}

const select = (table, field, value) => {
    return new Promise((resolve, reject) => {
        query(`SELECT * FROM ${table} WHERE ${field} = ${value}`, function(err, result) {
            if(err) reject(err);
            resolve(result);
        });
    });    
}

module.exports = {
    query,
    select
}