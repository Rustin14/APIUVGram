const { Sequelize } = require("sequelize");
const { sequelize } = require("../database/connectionDatabaseSequelize");
const { generateRandomCode } = require("../helpers/generateCode");
const { Post } = require("../models/Post");
const { PostFile } = require("../models/PostFile");
const { PostLike } = require("../models/PostLike");
const { User } = require("../models/User");
const { createURLResource, getServerURLAddress } = require("./urlRecoverDataAccess");

/**
 * Get all posts created by user id
 * @param {*} id_user id of user
 * @returns [...] array with elements or empty array []
 */
const getAllPostFromUserId = async (id_user) => {
    let posts = [];
    try {
        posts = await Post.findAll({
            where: { id_user },
            attributes: {
                include: [[Sequelize.fn('COUNT', Sequelize.col("PostLikes.id_post")), 'likes'], "postfile.filename"],
            },
            include: [{
                model: PostLike,
                attributes: []
            }, {
                model: PostFile,
                as: "postfile",
                attributes: []
            }],
            group: ["description", "comments_allowed", "likes_allowed", "uuid", "Post.id", "filename"],
            raw: true,
        });
    } catch (error) {
        throw error;
    }
    return posts;
};

/**
 * Get only Post data model description, comments_allowed, likes_allowed, uuid and id
 * @param {*} uuid the post identifier
 * @returns post or undefined.
 */
const getPostByUUID = async (uuid) => {
    let post;
    try {
        post = await Post.findOne({
            where: { uuid },
            attributes: ["description", "comments_allowed", "likes_allowed", "uuid", "id_user", "id"],
            raw: true
        });
    } catch (error) {
        throw error;
    }
    return post;
};

/**
 * Get all filenames (files) from post 
 * @param {*} id_post the post id
 * @returns [filenames] or empty array []
 */
const getPostFilenamesById = async (id_user, id_post) => {
    let filename;
    try {
        filename = await PostFile.findAll({
            where: { id_post },
            attributes: ["filename"],
            raw: true,
        });
        filename.forEach(name => {
            createURLResource(id_user, id_post, name.filename, getServerURLAddress()).then(result => {
                name.url = result;
                delete name.filename;
            })
        });

    } catch (error) {
        throw error;
    }
    return filename;
}

/**
 * Get all post data by id
 * @param {*} id the post id
 * @returns all data or undefined
 */
const getPostById = async (id) => {
    let post;
    try {
        post = await Post.findOne({
            where: { id },
            raw: true
        });
    } catch (error) {
        throw error;
    }
    return post;
}

/**
 * Get ID of post by uuid
 * @param {*} uuid the post identifier
 * @returns id or undefined
 */
const getIdPostByPostUUID = async (uuid) => {
    let id;
    try {
        let postData = await Post.findOne({
            where: { uuid },
            attributes: ["id"],
            raw: true
        });
        if (postData != null) {
            id = postData.id;
        }
    } catch (error) {
        throw error;
    }
    return id;
}

/**
 * Create a new post by user id
 * @param {*} id_user the user id who is creating the new post
 * @param {*} description post description
 * @param {*} comments_allowed boolean
 * @param {*} likes_allowed boolean
 * @param {*} file the file which is saving
 * @returns postData or null
 */
const createPostByUserId = async (id_user, description, comments_allowed, likes_allowed, files) => {
    let result = null;
    const uuid = generateRandomCode(11);
    const t = await sequelize.transaction();
    try {
        let postData = await Post.create({
            description,
            comments_allowed,
            likes_allowed,
            id_user,
            uuid
        }, { transaction: t });

        await Promise.all(files.map(async function (file) {
            let fileType = file.mimetype.replace(/(image\/|video\/)/g, '');
            let filename = `${generateRandomCode(12)}.${fileType}`;
            await PostFile.create({
                filename,
                id_post: postData.id
            }, { transaction: t });
            file.filename = filename;
        }));
        result = {
            ...postData.dataValues,
            files
        }
        await t.commit();
    } catch (error) {
        await t.rollback();
        throw error;
    }
    return result;
};

/**
 * Like a post
 * @param {*} id_user the user who is liking the post
 * @param {*} id_post the post which is being liked.
 * @returns true if liked otherwise false
 */
const likePostByIds = async (id_user, id_post) => {
    let isLiked = false;
    const t = await sequelize.transaction();
    try {
        await PostLike.create({
            id_user,
            id_post
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
}

/**
 * Dislike a post
 * @param {*} id_user the user who liked the post
 * @param {*} id_post the post which was liked by user
 * @returns true if remove liked otherwise false
 */
const dislikePostByIds = async (id_user, id_post) => {
    let isDisliked = false;
    const t = await sequelize.transaction();
    try {
        await PostLike.destroy({
            where: {
                id_user,
                id_post
            },
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
 * Check if post is alredy liked by user
 * @param {*} id_user the user id
 * @param {*} id_post the post id
 * @returns true if user already liked the post
 */
const isPostLikedByUser = async (id_user, id_post) => {
    let isAlreadyLikedByUser = false;
    try {
        let result = await PostLike.findOne({
            where: { id_post, id_user },
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
 * Get post count likes
 * @param {*} id_post the post id to get count likes
 * @returns likes number or 0
 */
const getPostLikesById = async (id_post) => {
    let count = 0;
    try {
        count = await PostLike.count({
            where: { id_post }
        })
    } catch (error) {
        throw error;
    }
    return count;
}

/**
 * Get users who liked a Post using id
 * @param {*} id_post the post to get likes
 * @returns [users] or [] (empty array)
 */
const getUsersWhoLikePostById = async (id_post) => {
    let users = [];
    try {
        users = await PostLike.findAll({
            where: { id_post },
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
 * Delete all likes of user from all user posts.
 * @param {*} id_user_to_remove the user to remove like
 * @param {*} id_user_posts_owner the post where to remove the like.
 * @returns true if removed otherwise false
 */
const deleteAllLikesOfUserFromAllPost = async (id_user_to_remove, id_user_posts_owner) => {
    let isDeleted = false;
    try {
        let postsOfUser = await getAllPostFromUserId(id_user_posts_owner);
        let countCommentsRemoved = 0;
        await Promise.all(postsOfUser.map(async function (post) {
            let postId = await getIdPostByPostUUID(post.uuid);
            if (postId) {
                let resultDelete = await dislikePostByIds(id_user_to_remove, postId);
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
 * Check if user is owner of specific post.
 * @param {*} id_user the owner of post
 * @param {*} id_post the post to retrieve information.
 * @returns true if is it otherwise false.
 */
const isUserOwnerOfPost = async (id_user, id_post) => {
    let isOwner = false;
    try {
        let result = await Post.findOne({
            where: { id_user, id: id_post },
            raw: true
        });
        if (result != null) {
            isOwner = true;
        }
    } catch (error) {
        throw error;
    }
    return isOwner;
}

/**
 * Delete post from user.
 * @param {*} id_user the owner of post
 * @param {*} id_post the post to remove
 * @returns true if removed otherwise false
 */
const deletePost = async (id_user, id_post) => {
    let isRemoved = false;
    const t = await sequelize.transaction();
    try {
        await Post.destroy({
            where: { id_user, id: id_post },
            transaction: t
        });
        await t.commit();
        isRemoved = true;
    } catch (error) {
        throw error;
    }
    return isRemoved;
}

/**
 * Count number post of user
 * @param {*} id_user 
 * @returns number of records or 0 if there is no post.
 */
const countPost = async (id_user) => {
    let count = 0;
    try {
        count = await Post.count({
            where: {
                id_user
            }
        });
    } catch (error) {
        throw error;
    }
    return count;
}

module.exports = {
    getAllPostFromUserId, createPostByUserId, getPostByUUID,
    getIdPostByPostUUID, likePostByIds, isPostLikedByUser,
    dislikePostByIds, getPostLikesById, getUsersWhoLikePostById,
    getPostById, deleteAllLikesOfUserFromAllPost, getPostFilenamesById,
    isUserOwnerOfPost, deletePost, countPost
}