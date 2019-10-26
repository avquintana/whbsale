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
    pool.query(sql, callback);
}

const select = (table, whereFields, whereValues) => {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(whereFields)) {
            whereFields = [whereFields];
            whereValues = [whereValues];
        }
        let sql = `SELECT * FROM ${table}`;
        whereFields.forEach((whereField, index) => {
            const whereValue = whereValues[index];
            if (index === 0) sql = `${sql} WHERE ${whereField} = ${whereValue}`;
            else sql = `${sql} AND ${whereField} = ${whereValue}`;
        });
        console.log(sql);
        query(sql, function (err, result) {
            if (err) reject(err);
            resolve(result);
        });
    });
}

const insert = (table, fields, values) => {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(fields)) {
            fields = [fields];
            values = [values];
        }
        let sql = `INSERT INTO ${table} (${fields.join(',')}) VALUES (${values.map(v => {
            // TODO: check v type
            return `'${v}'`;
        }).join(',')})`;
        console.log(sql);
        query(sql, function (err, result) {
            if (err) reject(err);
            resolve(result);
        });
    });
}

module.exports = {
    query,
    select,
    insert
}