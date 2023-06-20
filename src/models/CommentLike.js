const { sequelize } = require("../database/connectionDatabaseSequelize");
const { DataTypes } = require("sequelize");
const { User } = require("./User");
const { Comment } = require("./Comment");

const CommentLike = sequelize.define("CommentLike", {
    id_user: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    id_comment: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
}, {
    timestamps: false,
    freezeTableName: true
});

CommentLike.removeAttribute("id");

User.hasMany(CommentLike, {
    foreignKey: "id_user",
    sourceKey: "id",
});

CommentLike.belongsTo(User, {
    foreignKey: "id_user",
    targetKey: "id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

Comment.hasMany(CommentLike, {
    foreignKey: "id_comment",
    sourceKey: "id",
});

CommentLike.belongsTo(Comment, {
    foreignKey: "id_comment",
    targetKey: "id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

module.exports = { CommentLike };