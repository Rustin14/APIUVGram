const { sequelize } = require("../database/connectionDatabaseSequelize");
const { DataTypes } = require("sequelize");
const { Account } = require("./Account");

const URLRecover = sequelize.define("URLRecover", {
    uuid: {
        type: DataTypes.UUIDV4,
        allowNull: false,
    },
    action: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    id_user: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    token: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    timestamps: false,
    freezeTableName: true
});

URLRecover.removeAttribute("id");

URLRecover.hasOne(Account, {
    foreignKey: "id_user",
    sourceKey: "id_user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
})

Account.belongsTo(URLRecover, {
    foreignKey: "id_user",
    targetKey: "id_user",
});

module.exports = { URLRecover };