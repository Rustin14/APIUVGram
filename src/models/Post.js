const { sequelize } = require("../database/connectionDatabaseSequelize");
const { DataTypes } = require("sequelize");
const { User } = require("./User");

const Post = sequelize.define("Post", {
    description: {
        type: DataTypes.STRING
    },
    comments_allowed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    likes_allowed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    id_user: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    uuid: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    timestamps: false,
    freezeTableName: true
});

User.hasMany(Post, {
    foreignKey: "id_user",
    sourceKey: "id",
});

Post.belongsTo(User, {
    foreignKey: "id_user",
    targetKey: "id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

module.exports = { Post };