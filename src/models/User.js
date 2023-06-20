const { sequelize } = require("../database/connectionDatabaseSequelize");
const { DataTypes } = require("sequelize");

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING
    },
    presentation: {
        type: DataTypes.STRING
    },
    username: {
        type: DataTypes.STRING
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = { User };