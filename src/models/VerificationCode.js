const { sequelize } = require("../database/connectionDatabaseSequelize");
const { DataTypes } = require("sequelize");

const VerificationCode = sequelize.define("VerificationCode", {
    code: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    username: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = { VerificationCode };