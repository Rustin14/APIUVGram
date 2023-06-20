const { sequelize } = require("../database/connectionDatabaseSequelize");
const { DataTypes } = require("sequelize");
const { Account } = require("./Account");

const Session = sequelize.define("Session", {
    id_user: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    token: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    device: {
        type: DataTypes.TEXT
    }
}, {
    timestamps: false,
    freezeTableName: true
});

Session.removeAttribute("id");

Session.hasOne(Account, {
    foreignKey: "id_user",
    sourceKey: "id_user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
})

Account.belongsTo(Session, {
    foreignKey: "id_user",
    targetKey: "id_user",
});

module.exports = { Session };