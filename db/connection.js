const mysql = require('mysql2');
// const Sequelize = require('sequelize');
const util = require('util');
const config = require('./config');

// var queryBuilder = require('eloquent-query-builder');
// const options = {
//   host: config.mysql.host,
//   logging: false,
//   dialect: 'mysql',
// }

const conn = mysql.createConnection(config.mysql);

conn.connect(err => {
    if(err) console.warn("ERROR",err);
    else console.log("Database Connected");
})

const db = util.promisify(conn.query).bind(conn);

// const sequelize = new Sequelize(config.mysql.database, config.mysql.user, config.mysql.password, options);
// const DBO = new queryBuilder(sequelize);


module.exports = db;