const { sequelize } = require("../database/connectionDatabaseSequelize");
const { DataTypes } = require("sequelize");
const { User } = require("./User");

const Block = sequelize.define("Block", {
    id_user_blocker: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    id_user_blocked: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
}, {
    timestamps: false,
    freezeTableName: true
});

Block.removeAttribute("id");

Block.hasMany(User, {
    as: "blocked",
    foreignKey: "id",
    sourceKey: "id_user_blocked"
});

User.belongsTo(Block, {
    as: "blocked",
    foreignKey: "id",
    targetKey: "id_user_blocked"
})
Block.belongsTo(User, {
    as: "blocker",
    foreignKey: "id_user_blocker",
    targetKey: "id"
});

User.hasMany(Block, {
    as: "blocker",
    foreignKey: "id_user_blocker",
    sourceKey: "id"
})

module.exports = { Block };