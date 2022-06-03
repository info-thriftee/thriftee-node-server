const mysql = require('mysql');
// const Sequelize = require('sequelize');
const config = require('./config');

// var queryBuilder = require('eloquent-query-builder');
// const options = {
//   host: config.mysql.host,
//   logging: false,
//   dialect: 'mysql',
// }

const db = mysql.createConnection(config.mysql);

// const sequelize = new Sequelize(config.mysql.database, config.mysql.user, config.mysql.password, options);
// const DBO = new queryBuilder(sequelize);

db.connect(err => {
    if(err) console.warn("ERROR",err);
    else console.log("Database Connected");
})

module.exports = db;