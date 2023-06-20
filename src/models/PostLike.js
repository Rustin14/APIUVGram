const { sequelize } = require("../database/connectionDatabaseSequelize");
const { DataTypes } = require("sequelize");
const { User } = require("./User");
const { Post } = require("./Post");

const PostLike = sequelize.define("PostLike", {
    id_user: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    id_post: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
}, {
    timestamps: false,
    freezeTableName: true
});

PostLike.removeAttribute("id");

User.hasMany(PostLike, {
    foreignKey: "id_user",
    sourceKey: "id",
});

PostLike.belongsTo(User, {
    foreignKey: "id_user",
    targetKey: "id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

Post.hasMany(PostLike, {
    foreignKey: "id_post",
    sourceKey: "id",
});

PostLike.belongsTo(Post, {
    foreignKey: "id_post",
    targetKey: "id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});


module.exports = { PostLike };