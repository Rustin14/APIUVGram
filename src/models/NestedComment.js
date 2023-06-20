const { sequelize } = require("../database/connectionDatabaseSequelize");
const { DataTypes } = require("sequelize");
const { Comment } = require("./Comment");

const NestedComment = sequelize.define("NestedComment", {
    parent_id_comment: {
        type: DataTypes.STRING,
    },
    child_id_comment: {
        type: DataTypes.STRING
    },
}, {
    timestamps: false,
    freezeTableName: true
});

NestedComment.removeAttribute("id");

Comment.hasMany(NestedComment, {
    as: "NestedCommentParent",
    foreignKey: "child_id_comment",
    sourceKey: "id",
});

NestedComment.belongsTo(Comment, {
    as: "NestedCommentParent",
    foreignKey: "child_id_comment",
    targetKey: "id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

Comment.hasOne(NestedComment, {
    as: "NestedCommentChild",
    foreignKey: "parent_id_comment",
    targetKey: "id"
});

NestedComment.belongsTo(Comment, {
    as: "NestedCommentChild",
    foreignKey: "parent_id_comment",
    targetKey: "id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
})

module.exports = { NestedComment };