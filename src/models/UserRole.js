const { sequelize } = require("../database/connectionDatabaseSequelize");
const { DataTypes } = require("sequelize");
const { User } = require("./User");
const { UserRoleType } = require("./enum/UserRoleType");

const UserRole = sequelize.define("UserRole", {
    id_user: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
    },
    role: {
        type: DataTypes.ENUM(UserRoleType.PERSONAL, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.ADMINISTRATOR)
    }
}, {
    timestamps: false,
    freezeTableName: true
});

UserRole.hasOne(User, {
    foreignKey: "id",
    sourceKey: "id_user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

User.belongsTo(UserRole, {
    foreignKey: "id",
    targetKey: "id_user",
});

module.exports = { UserRole };