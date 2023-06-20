const { sequelize } = require("../database/connectionDatabaseSequelize");
const { DataTypes } = require("sequelize");

const Region = sequelize.define("Region", {
    region: {
        type: DataTypes.STRING
    },
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = { Region };