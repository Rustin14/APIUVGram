const { sequelize } = require("../database/connectionDatabaseSequelize");
const { DataTypes } = require("sequelize");
const { User } = require("./User");

const Account = sequelize.define("Account", {
    email: {
        type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING
    },
    id_user: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: true
    },
    birthday: {
        type: DataTypes.DATE,
        allowNull: false
    },
}, {
    timestamps: false,
    freezeTableName: true
});

Account.hasOne(User, {
    foreignKey: "id",
    sourceKey: "id_user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

User.belongsTo(Account, {
    foreignKey: "id",
    targetKey: "id_user",
});

module.exports = { Account };
