const { DataTypes } = require("sequelize");
const Db = require("../database");
const User = require("./user");

const Task = Db.define("task", {
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    time: {
        type: DataTypes.DATE,
        allowNull: false,
    },
})

User.hasMany(Task, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
})
module.exports = Task;