const { sequelize } = require("../database/connectionDatabaseSequelize");
const { DataTypes } = require("sequelize");
const { UserRole } = require("./UserRole");

const AdministratorUserRole = sequelize.define("Administrator", {
    id_user: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
    }
}, {
    timestamps: false,
    freezeTableName: true
});

AdministratorUserRole.hasOne(UserRole, {
    foreignKey: "id_user",
    sourceKey: "id_user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

UserRole.belongsTo(AdministratorUserRole, {
    foreignKey: "id_user",
    targetKey: "id_user"
});

module.exports = { AdministratorUserRole };