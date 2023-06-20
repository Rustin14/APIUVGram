const { sequelize } = require("../database/connectionDatabaseSequelize");
const { DataTypes } = require("sequelize");
const { UserRole } = require("./UserRole");

const ModeratorUserRole = sequelize.define("Moderator", {
    update_date: {
        type: DataTypes.DATE
    },
    id_user: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
    }
}, {
    timestamps: false,
    freezeTableName: true
});

ModeratorUserRole.hasOne(UserRole, {
    foreignKey: "id_user",
    sourceKey: "id_user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

UserRole.belongsTo(ModeratorUserRole, {
    foreignKey: "id_user",
    targetKey: "id_user"
});

module.exports = { ModeratorUserRole };