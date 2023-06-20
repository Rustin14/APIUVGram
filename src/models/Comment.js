const { sequelize } = require("../database/connectionDatabaseSequelize");
const { DataTypes } = require("sequelize");
const { User } = require("./User");
const { Post } = require("./Post");

const Comment = sequelize.define("Comment", {
    comment: {
        type: DataTypes.STRING,
    },
    created_time: {
        type: DataTypes.STRING
    },
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    id_post: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    id_user: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    uuid: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    timestamps: false,
    freezeTableName: true
});

Post.hasMany(Comment, {
    foreignKey: "id_user",
    sourceKey: "id",
});

Comment.belongsTo(Post, {
    foreignKey: "id_post",
    targetKey: "id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

User.hasMany(Comment, {
    foreignKey: "id_user",
    sourceKey: "id"
});

Comment.belongsTo(User, {
    foreignKey: "id_user",
    targetKey: "id"
});


module.exports = { Comment };