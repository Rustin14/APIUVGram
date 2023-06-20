const { sequelize } = require("../database/connectionDatabaseSequelize");
const { DataTypes } = require("sequelize");
const { Region } = require("./Region");

const Faculty = sequelize.define("Faculty", {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    faculty: {
        type: DataTypes.STRING
    },
    id_region: {
        type: DataTypes.BIGINT
    }
}, {
    timestamps: false,
    freezeTableName: true
});

Faculty.hasOne(Region, {
    foreignKey: "id",
    targetKey: "id_region",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

Region.belongsTo(Faculty, {
    foreignKey: "id",
    targetKey: "id_region"
})


module.exports = { Faculty };