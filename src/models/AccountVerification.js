const { sequelize } = require("../database/connectionDatabaseSequelize");
const { DataTypes } = require("sequelize");
const { Account } = require("./Account");
const { AccountStatusType } = require("./enum/AccountStatusType");

const AccountVerification = sequelize.define("AccountVerification", {
    account_status: {
        type: DataTypes.ENUM(AccountStatusType.BLOCKED, AccountStatusType.UNBLOCKED)
    },
    id_user: {
        type: DataTypes.BIGINT
    }
}, {
    timestamps: false,
    freezeTableName: true
});

AccountVerification.removeAttribute("id");

AccountVerification.hasOne(Account, {
    foreignKey: "id_user",
    sourceKey: "id_user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

Account.belongsTo(AccountVerification, {
    foreignKey: "id_user",
    targetKey: "id_user"
});

module.exports = { AccountVerification };