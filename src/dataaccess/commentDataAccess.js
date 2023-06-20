const { Sequelize, Op } = require("sequelize");
const { sequelize } = require("../database/connectionDatabaseSequelize");
const { generateRandomUUID } = require("../helpers/generateCode");
const { Comment } = require("../models/Comment");
const { CommentLike } = require("../models/CommentLike");
const { NestedComment } = require("../models/NestedComment");
const { User } = require("../models/User");
const { getAllPostFromUserId, getIdPostByPostUUID } = require("./postDataAccess");

/**
 * Create a new comment in a post
 * @param {*} comment data
 * @param {*} id_post the post id which will be commented
 * @param {*} id_user the user who is commenting.
 * @returns object with data or undefined
 */
const createCommentInPost = async (comment, id_post, id_user) => {
    let result;
    const t = await sequelize.transaction();
    try {
        let uuid = generateRandomUUID(11);
        let object = await Comment.create({
            comment,
            id_post,
            id_user,
            uuid
        }, { transaction: t })
        await t.commit();
        result = {
            comment: object.comment,
            uuid: object.uuid,
            created_time: object.created_time
        }
    } catch (error) {
        await t.rollback();
        throw error;
    }
    return result;
};

/**
 * Get all comments of post
 * @param {*} id_post the post to get the comments.
 * @returns [data] or [] with 0 elements. */
const getAllCommentsByIdPost = async (id_post) => {
    let comments = [];
    try {
        let parentComments = await Comment.findAll({
            where: {
                id_post,
                '$NestedCommentParent.parent_id_comment$': { [Op.eq]: null },
                '$NestedCommentParent.child_id_comment$': { [Op.eq]: null }
            },
            attributes: {
                include: ["User.username", "comment", "created_time", "uuid", "id",
                    [Sequelize.fn('COUNT', Sequelize.col("id_comment")), 'likes']
                ],
                exclude: ["id_post", "id_user"]
            },
            include: [{
                model: NestedComment,
                as: "NestedCommentParent",
                attributes: []
            },
            {
                model: CommentLike,
                attributes: []
            }, {
                model: User,
                attributes: []
            }
            ],
            order: [
                ["created_time", "ASC"]
            ],
            group: ["username", "Comment.comment", "Comment.created_time", "Comment.uuid", "Comment.id",],
            raw: true,
        });
        await Promise.all(parentComments.map(async function (parentComment) {
            try {
                let childComments = await Comment.findAll({
                    where: {
                        '$NestedCommentParent.parent_id_comment$': parentComment.id
                    },
                    attributes: {
                        include: ["User.username", "comment", "created_time", "uuid", "id",
                            [Sequelize.fn('COUNT', Sequelize.col("id_comment")), 'likes']
                        ],
                        exclude: ["id_post", "id_user"]
                    },
                    include: [{
                        model: NestedComment,
                        as: "NestedCommentParent",
                        attributes: []
                    }, {
                        model: User,
                        attributes: []
                    }, {
                        model: CommentLike,
                        attributes: []
                    }],
                    order: [
                        ["created_time", "ASC"]
                    ],
                    group: ["username", "Comment.comment", "Comment.created_time", "Comment.uuid", "Comment.id",],
                    raw: true,
                });
                parentComment.replies = childComments;
            } catch (error) {
                throw error;
            }
        }));
        comments = parentComments
    } catch (error) {
        throw error;
    }
    return comments;
};

/**
 * Like a comment by IDS
 * @param {*} id_user the user who is liking a comment.
 * @param {*} id_comment the comment that is being liked 
 * @returns true if comment was liked otherwise false
 */
const likeCommentByIds = async (id_user, id_comment) => {
    let isLiked = false;
    const t = await sequelize.transaction();
    try {
        await CommentLike.create({
            id_user,
            id_comment
        }, {
            transaction: t
        });
        await t.commit();
        isLiked = true;
    } catch (error) {
        await t.rollback();
        throw error;
    }
    return isLiked;
};

/**
 * Dislike a comment by IDS
 * @param {*} id_user the user who is disliking a comment
 * @param {*} id_comment the comment that is being disliked
 * @returns true if comment was disliked otherwise false
 */
const dislikeCommentByIds = async (id_user, id_comment) => {
    let isDisliked = false;
    const t = await sequelize.transaction();
    try {
        await CommentLike.destroy({
            where: {
                id_user,
                id_comment
            }
        }, {
            transaction: t
        });
        await t.commit();
        isDisliked = true;
    } catch (error) {
        await t.rollback();
        throw error;
    }
    return isDisliked;
}

/**
 * Get comment ID by UUID identifier
 * @param {*} uuid the uuuid identifier
 * @returns id or undefined
 */
const getIdCommentByUUID = async (uuid) => {
    let id;
    try {
        let commentData = await Comment.findOne({
            where: { uuid },
            attributes: ["id"],
            raw: true
        });
        if (commentData != null) {
            id = commentData.id;
        }
    } catch (error) {
        throw error;
    }
    return id;
};

/**
 * Get comment by UUID
 * @param {*} uuid the uuid identifier
 * @returns all comment data or undefined
 */
const getCommentByUUID = async (uuid) => {
    let comment;
    try {
        comment = await Comment.findOne({
            where: { uuid },
            raw: true
        });
    } catch (error) {
        throw error;
    }
    return comment;
}

/**
 * Count all comments from post
 * @param {*} id_post the id to count the comments
 * @returns 0 or more than 0;
 */
const getCommentsCountById = async (id_post) => {
    let count = 0;
    try {
        count = await Comment.count({
            where: { id_post }
        })
    } catch (error) {
        throw error;
    }
    return count;
}


/**
 * Get the root comment recursively
 * @param {*} id the actual comment
 * @returns the root comment or undefined
 */
const getCommentParentById = async (id) => {
    let comment;
    try {
        comment = await Comment.findOne({
            where: { id },
            attributes: {
                include: ["comment", "created_time", "uuid", "id", "id_post", "id_user"],
            },
            include: [{
                model: NestedComment,
                as: "NestedCommentParent",
                attributes: ["parent_id_comment"]
            }],
            raw: true,
        });
        if (comment["NestedCommentParent.parent_id_comment"] != null) {
            comment = await getCommentParentById(comment["NestedCommentParent.parent_id_comment"]);
            comment.isParent = true;
        } else {
            comment.isParent = false;
        }
        delete comment["NestedCommentParent.parent_id_comment"];
    } catch (error) {
        throw error;
    }
    return comment;
}

/**
 * Check if comment is already liked by user
 * @param {*} id_user the user who liked a comment
 * @param {*} id_comment the comment that is liked
 * @returns true if liked otherwise false.
 */
const isCommentLikedByUser = async (id_user, id_comment) => {
    let isAlreadyLikedByUser = false;
    try {
        let result = await CommentLike.findOne({
            where: { id_comment, id_user },
            raw: true
        });
        if (result != null) {
            isAlreadyLikedByUser = true;
        }
    } catch (error) {
        throw error;
    }
    return isAlreadyLikedByUser;
}

/**
 * Get likes of comment
 * @param {*} id_comment the comment to get count likes 
 * @returns 0 or more than 0
 */
const getCommentsLikesById = async (id_comment) => {
    let count = 0;
    try {
        count = await CommentLike.count({
            where: { id_comment }
        })
    } catch (error) {
        throw error;
    }
    return count;
}

/**
 * Get the users who like a specific comment
 * @param {*} id_comment the specific comment
 * @returns [users] or [] (empty array).
 */
const getUsersWhoLikeCommentById = async (id_comment) => {
    let users = [];
    try {
        users = await CommentLike.findAll({
            where: { id_comment },
            attributes: ["User.*"],
            include: {
                model: User,
                attributes: []
            },
            raw: true,
        });
    } catch (error) {
        throw error;
    }
    return users;
}

/**
 * Delete a comment by id
 * @param {*} id the comment id
 * @returns true if removed otherwise false
 */
const deleteCommentById = async (id) => {
    let isDeleted = false;
    const t = await sequelize.transaction();
    try {
        let data = await Comment.destroy({
            where: { id },
            transaction: t
        });
        await t.commit();
        if (data > 0) {
            isDeleted = true;
        }
    } catch (error) {
        throw error;
    }
    return isDeleted;
}

/**
 * Create answer to parent comment!
 * @param {*} parent_id_comment the ID to reply to a comment
 * @param {*} comment the reply content
 * @param {*} id_post the id of post where is it replying
 * @param {*} id_user the user id who is replying.
 * @returns object with comment result or undefined
 */
const createAnswerComment = async (parent_id_comment, comment, id_post, id_user) => {
    let result;
    const t = await sequelize.transaction();
    try {
        let uuid = generateRandomUUID(11);
        let object = await Comment.create({
            comment,
            id_post,
            id_user,
            uuid
        }, { transaction: t })

        await NestedComment.create({
            parent_id_comment,
            child_id_comment: object.id
        }, { transaction: t });

        await t.commit();
        result = {
            comment: object.comment,
            uuid: object.uuid,
            created_time: object.created_time
        }
    } catch (error) {
        await t.rollback();
        throw error;
    }
    return result;
}

/**
 * Delete all user comments of post.
 * @param {*} id_user the id of user to remove comments
 * @param {*} id_post the post where to remove the comments
 * @returns true if deleted otherwise false
 */
const deleteAllComentsOfUserByPostId = async (id_user, id_post) => {
    let isDeleted = false;
    const t = await sequelize.transaction();
    try {
        let data = await Comment.destroy({
            where: { id_user, id_post },
            transaction: t
        });
        await t.commit();
        if (data > 0) {
            isDeleted = true;
        }
    } catch (error) {
        throw error;
    }
    return isDeleted;
}

/**
 * Delete all comments of user of all user posts.
 * @param {*} id_user_to_remove the user id to remove all comments
 * @param {*} id_user_posts_owner the owner of posts.
 * @returns true if deleted otherwise false.
 */
const deleteAllCommentsOfUserFromAllUserPost = async (id_user_to_remove, id_user_posts_owner) => {
    let isDeleted = false;
    try {
        let postsOfUser = await getAllPostFromUserId(id_user_posts_owner);
        let countCommentsRemoved = 0;
        await Promise.all(postsOfUser.map(async function (post) {
            let postId = await getIdPostByPostUUID(post.uuid);
            if (postId) {
                let resultDelete = await deleteAllComentsOfUserByPostId(id_user_to_remove, postId);
                if (resultDelete) {
                    countCommentsRemoved = countCommentsRemoved + 1;
                }
            }
        }));
        if (countCommentsRemoved > 0) {
            isDeleted = true;
        }
    } catch (error) {
        throw error;
    }
    return isDeleted;
}

/**
 * Get all comments of user
 * @param {*} id_user the user to get commments
 * @returns [comments] or empty array []
 */
const getAllCommentsOfUserId = async (id_user) => {
    let comments = [];
    try {
        comments = await Comment.findAll({
            where: {
                id_user,
            },
            raw: true,
        });
    } catch (error) {
        throw error;
    }
    return comments;
}

/**
 * Delete all likes of user from all user comments
 * @param {*} id_user_to_remove the user to remove likes
 * @param {*} id_user_comments_owner the user owner of comments
 * @returns true if deleted otherwise false
 */
const deleteAllUserLikesFromUserComments = async (id_user_to_remove, id_user_comments_owner) => {
    let isDeleted = false;
    try {
        let commentsOfUser = await getAllCommentsOfUserId(id_user_comments_owner);
        let countCommentsRemoved = 0;
        await Promise.all(commentsOfUser.map(async function (comment) {
            let commentId = await getIdCommentByUUID(comment.uuid);
            if (commentId) {
                let resultDelete = await dislikeCommentByIds(id_user_to_remove, commentId);
                if (resultDelete) {
                    countCommentsRemoved = countCommentsRemoved + 1;
                }
            }
        }));
        if (countCommentsRemoved > 0) {
            isDeleted = true;
        }
    } catch (error) {
        throw error;
    }
    return isDeleted;
}

module.exports = {
    createCommentInPost, getAllCommentsByIdPost, likeCommentByIds,
    dislikeCommentByIds, getIdCommentByUUID, getCommentByUUID,
    isCommentLikedByUser, getUsersWhoLikeCommentById, getCommentsLikesById,
    deleteCommentById, createAnswerComment, getCommentParentById,
    deleteAllCommentsOfUserFromAllUserPost, deleteAllUserLikesFromUserComments,
    getCommentsCountById
}