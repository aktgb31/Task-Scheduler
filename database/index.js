const Sequelize = require('sequelize');
const { DATABASE } = require('../config');

const Db = new Sequelize(DATABASE.NAME, DATABASE.USER_NAME, DATABASE.PASSWORD, {
    dialect: 'sqlite',
    storage: __dirname + '/database.sqlite',
    logging: false
});

module.exports = Db;