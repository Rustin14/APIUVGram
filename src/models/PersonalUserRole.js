const { sequelize } = require("../database/connectionDatabaseSequelize");
const { DataTypes } = require("sequelize");
const { UserRole } = require("./UserRole");
const { GenderType } = require("./enum/GenderType");

const PersonalUserRole = sequelize.define("Personal", {
    gender: {
        type: DataTypes.ENUM(GenderType.MALE, GenderType.FEMININE, GenderType.INDIFFERENT)
    },
    id_career: {
        type: DataTypes.BIGINT
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

PersonalUserRole.hasOne(UserRole, {
    foreignKey: "id_user",
    sourceKey: "id_user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

UserRole.belongsTo(PersonalUserRole, {
    foreignKey: "id_user",
    targetKey: "id_user"
});

module.exports = { PersonalUserRole };