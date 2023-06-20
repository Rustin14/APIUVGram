const { sequelize } = require("../database/connectionDatabaseSequelize");
const { DataTypes } = require("sequelize");
const { User } = require("./User");
const { PrivacyType } = require("./enum/PrivacyType");

const UserConfiguration = sequelize.define("UserConfiguration", {
    privacy: {
        type: DataTypes.ENUM(PrivacyType.PUBLIC, PrivacyType.PRIVATE)
    },
    id_user: {
        type: DataTypes.STRING
    }
}, {
    timestamps: false,
    freezeTableName: true
});

UserConfiguration.removeAttribute("id");

User.hasOne(UserConfiguration, {
    foreignKey: "id_user",
    targetKey: "id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

UserConfiguration.belongsTo(User, {
    foreignKey: "id_user",
    targetKey: "id"
});

module.exports = { UserConfiguration };