const { DataTypes } = require("sequelize");
const Db = require("../database");

const User = Db.define("user", {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
})

module.exports = User;