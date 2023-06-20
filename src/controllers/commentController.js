const { createCommentInPost, getAllCommentsByIdPost, getIdCommentByUUID, likeCommentByIds, dislikeCommentByIds, getUsersWhoLikeCommentById, getCommentByUUID, deleteCommentById, createAnswerComment, getCommentParentById } = require("../dataaccess/commentDataAccess");
const { getIdPostByPostUUID } = require("../dataaccess/postDataAccess");
const { verifyToken } = require("../dataaccess/tokenDataAccess");
const { isUserFollowedByUser } = require("../dataaccess/userDataAccess");
const { httpResponseInternalServerError, httpResponseOk } = require("../helpers/httpResponses");

const createCommentPost = async (request, response) => {
    const token = (request.headers.authorization).split(" ")[1];
    const { comment, uuid } = request.body;
    let isCreated = false;
    let commentDetails;
    try {
        const userDataId = await verifyToken(token).then(data => { return data.id });
        let postDataId = await getIdPostByPostUUID(uuid);
        commentDetails = await createCommentInPost(comment, postDataId, userDataId);
        if (commentDetails) {
            isCreated = true;
        }
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, { isCreated, commentDetails });
};

const getAllCommentsOfUUIDPost = async (request, response) => {
    const uuid = request.params.uuid;
    let comments = [];
    try {
        let postDataId = await getIdPostByPostUUID(uuid);
        comments = await getAllCommentsByIdPost(postDataId);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, comments);
};

const likeComment = async (request, response) => {
    const token = (request.headers.authorization).split(" ")[1];
    const { uuid } = request.body;
    let isLiked = false;
    try {
        const userDataId = await verifyToken(token).then(data => { return data.id });
        const commentId = await getIdCommentByUUID(uuid);
        isLiked = await likeCommentByIds(userDataId, commentId);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, isLiked);
};

const dislikeComment = async (request, response) => {
    const token = (request.headers.authorization).split(" ")[1];
    const { uuid } = request.body;
    let isDisliked = false;
    try {
        const userDataId = await verifyToken(token).then(data => { return data.id });
        const commentId = await getIdCommentByUUID(uuid);
        isDisliked = await dislikeCommentByIds(userDataId, commentId);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, isDisliked);
};

const getUsersWhoLikesComment = async (request, response) => {
    const token = (request.headers.authorization).split(" ")[1];
    const uuid = request.params.uuid;
    let likedBy = [];
    try {
        const userDataId = await verifyToken(token).then(data => { return data.id });
        const commetId = await getIdCommentByUUID(uuid);
        let usersResult = await getUsersWhoLikeCommentById(commetId);
        await Promise.all(usersResult.map(async function (data) {
            try {
                data.isFollowed = await isUserFollowedByUser(userDataId, data.id);
                delete data["id"];
                delete data["presentation"]
            } catch (error) {
                throw error;
            }
        }));
        likedBy = usersResult;
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, { likedBy });
}

const deleteComment = async (request, response) => {
    const { uuid } = request.body;
    let isDeleted = false;
    try {
        const commentData = await getCommentByUUID(uuid);
        isDeleted = await deleteCommentById(commentData.id);
    } catch (error) {
        return httpResponseInternalServerError(response, error)
    }
    return httpResponseOk(response, isDeleted)
}

module.exports = {
    createCommentPost, getAllCommentsOfUUIDPost, likeComment,
    dislikeComment, getUsersWhoLikesComment, deleteComment,
}