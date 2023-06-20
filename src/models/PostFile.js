const { sequelize } = require("../database/connectionDatabaseSequelize");
const { DataTypes } = require("sequelize");
const { Post } = require("./Post");

const PostFile = sequelize.define("PostFile", {
    filename: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    id_post: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
}, {
    timestamps: false,
    freezeTableName: true
});

PostFile.removeAttribute("id");

Post.hasMany(PostFile, {
    as: "postfile",
    foreignKey: "id_post",
    sourceKey: "id",
});

PostFile.belongsTo(Post, {
    as: "postfile",
    foreignKey: "id_post",
    targetKey: "id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});


module.exports = { PostFile };