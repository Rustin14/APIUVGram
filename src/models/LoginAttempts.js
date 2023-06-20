const { sequelize } = require("../database/connectionDatabaseSequelize");
const { DataTypes } = require("sequelize");
const { LoginStateType } = require("./enum/LoginStateType");

const LoginAttempts = sequelize.define("LoginAttempts", {
    attempts: {
        type: DataTypes.STRING
    },
    login_state: {
        type: DataTypes.ENUM(LoginStateType.BLOCKED, LoginStateType.UNBLOCKED),
        allowNull: false,
    },
    mac_address: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = { LoginAttempts };