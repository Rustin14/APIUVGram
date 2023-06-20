const { getAllCommentsByIdPost, getCommentsCountById, isCommentLikedByUser } = require("../dataaccess/commentDataAccess");
const { saveFiles } = require("../dataaccess/fileServerDataAccess");
const { getAllPostFromUserId, createPostByUserId, getPostByUUID, getIdPostByPostUUID, likePostByIds, dislikePostByIds, getPostLikesById, getUsersWhoLikePostById, getPostFilenamesById, isPostLikedByUser, deletePost } = require("../dataaccess/postDataAccess");
const { verifyToken } = require("../dataaccess/tokenDataAccess");
const { getAccountLoginData, isUserFollowedByUser, getUserProfile } = require("../dataaccess/userDataAccess");
const { httpResponseInternalServerError, httpResponseOk } = require("../helpers/httpResponses");

const getPostsByUsername = async (request, response) => {
    const username = request.params.username;
    let posts = [];
    try {
        let userData = await getAccountLoginData(username);
        posts = await getAllPostFromUserId(userData.id);
        await Promise.all(posts.map(async function (post) {
            let postId = await getIdPostByPostUUID(post.uuid);
            if (!postId) {
                post.comments = 0;
                return;
            }
            post.comments = await getCommentsCountById(postId);
            post.isLiked = await isPostLikedByUser(userData.id, postId);
            post.files = await getPostFilenamesById(post.id_user, post.id);
            delete post["id_user"];
            delete post["id"];
        }));
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, posts);
};

const getPostDataByUUID = async (request, response) => {
    const uuid = request.params.uuid;
    let postDetails = null;
    const token = (request.headers.authorization).split(" ")[1];
    try {
        const userDataId = await verifyToken(token).then(data => { return data.id });
        let postData = await getPostByUUID(uuid);
        postData.isLiked = await isPostLikedByUser(userDataId, postData.id);
        let commentData = await getAllCommentsByIdPost(postData.id);
        await Promise.all(commentData.map(async function (comment) {
            comment.isLiked = await isCommentLikedByUser(userDataId, comment.id);
            await Promise.all(comment.replies.map(async function (reply) {
                reply.isLiked = await isCommentLikedByUser(userDataId, reply.id);
                delete reply["id"];
            }));

            delete comment["id"];
        }));

        let ownerOfPost = await getUserProfile(postData.id_user);
        delete ownerOfPost["presentation"];
        let countLikes = await getPostLikesById(postData.id);
        let files = await getPostFilenamesById(postData.id_user, postData.id);
        delete postData["id_user"];
        delete postData["id"];
        postDetails = {
            post: postData,
            likes: countLikes,
            comments: commentData,
            files: files,
            owner: ownerOfPost
        }
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, postDetails);
}

const createPost = async (request, response) => {
    const { description, commentsAllowed, likesAllowed } = request.body;
    const files = [].concat(request.files["file[]"]);
    const token = (request.headers.authorization).split(" ")[1];
    let isCreated = false;
    let postInfo;
    try {
        const userDataId = await verifyToken(token).then(data => { return data.id });
        let postDataCreated = await createPostByUserId(userDataId, description, commentsAllowed, likesAllowed, files);
        if (postDataCreated != null) {
            postInfo = postDataCreated;
            let resultFiles = postDataCreated.files;
            await saveFiles(resultFiles, userDataId, postDataCreated.id);
        }
        delete postInfo["id"];
        delete postInfo["id_user"]
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, { isCreated, postInfo });
};

const likePost = async (request, response) => {
    const token = (request.headers.authorization).split(" ")[1];
    const { uuid } = request.body;
    let isLiked = false;
    try {
        const userDataId = await verifyToken(token).then(data => { return data.id });
        const postDataId = await getIdPostByPostUUID(uuid);
        isLiked = await likePostByIds(userDataId, postDataId);

    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, isLiked);
};

const dislikePost = async (request, response) => {
    const token = (request.headers.authorization).split(" ")[1];
    const { uuid } = request.body;
    let isUnliked = false;
    try {
        const userDataId = await verifyToken(token).then(data => { return data.id });
        const postDataId = await getIdPostByPostUUID(uuid);
        isUnliked = await dislikePostByIds(userDataId, postDataId);

    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, isUnliked);
};

const getUsersWhoLikesPost = async (request, response) => {
    const token = (request.headers.authorization).split(" ")[1];
    const uuid = request.params.uuid;
    let likedBy = [];
    try {
        const userDataId = await verifyToken(token).then(data => { return data.id });
        const postDataId = await getIdPostByPostUUID(uuid);
        let usersResult = await getUsersWhoLikePostById(postDataId);
        await Promise.all(usersResult.map(async function (data) {
            try {
                data.isFollowed = await isUserFollowedByUser(userDataId, data.id);
                delete data["id"];
                delete data["presentation"];
            } catch (error) {
                throw error;
            }
        }));
        likedBy = usersResult;
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, { likedBy });
};

const deletePostOfUser = async (request, response) => {
    const token = (request.headers.authorization).split(" ")[1];
    const uuid = request.body.uuid;
    let isRemoved = false;
    try {
        const userDataId = await verifyToken(token).then(data => { return data.id });
        const postDataId = await getIdPostByPostUUID(uuid);
        isRemoved = await deletePost(userDataId, postDataId);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, { isRemoved });
};

module.exports = {
    getPostsByUsername, createPost, getPostDataByUUID,
    likePost, dislikePost, getUsersWhoLikesPost, deletePostOfUser
}