const { getCommentByUUID, getIdCommentByUUID, isCommentLikedByUser } = require("../dataaccess/commentDataAccess");
const { getPostById } = require("../dataaccess/postDataAccess");
const { verifyToken } = require("../dataaccess/tokenDataAccess");
const { httpResponseForbidden, httpResponseInternalServerError } = require("../helpers/httpResponses");

const validationDoesExistCommentUUID = async (request, response, next) => {
    let uuid = request.params.uuid;
    if (!uuid) uuid = request.body.uuid;
    try {
        let commentData = await getCommentByUUID(uuid);
        if (!commentData) {
            return httpResponseForbidden(response, "no comment found");
        }
        let ownerResourcePost = await getPostById(commentData.id_post);
        let ownerResource = ownerResourcePost.id_user;
        response.locals.ownerResourceUserId = ownerResource;
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return next();
};

const validationIsCommentAlreadyLikedByUser = async (request, response, next) => {
    const token = (request.headers.authorization).split(" ")[1];
    const { uuid } = request.body;
    let isAlreadyLikedByUser;
    try {
        const userDataId = await verifyToken(token).then(data => { return data.id });
        const commentDataId = await getIdCommentByUUID(uuid);
        isAlreadyLikedByUser = await isCommentLikedByUser(userDataId, commentDataId);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    if (isAlreadyLikedByUser) {
        return httpResponseForbidden(response, "comment is already liked");
    }
    return next();
};

const validationIsCommentAlreadyDislikedByUser = async (request, response, next) => {
    const token = (request.headers.authorization).split(" ")[1];
    const { uuid } = request.body;
    let isAlreadydislikedByUser;
    try {
        const userDataId = await verifyToken(token).then(data => { return data.id });
        const commentDataId = await getIdCommentByUUID(uuid);
        isAlreadydislikedByUser = !(await isCommentLikedByUser(userDataId, commentDataId));
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    if (isAlreadydislikedByUser) {
        return httpResponseForbidden(response, "comment is already disliked");
    }
    return next();
};

const validationDeleteCommentIfOwner = async (request, response, next) => {
    const token = (request.headers.authorization).split(" ")[1];
    const { uuid } = request.body;
    try {
        const userDataId = await verifyToken(token).then(data => { return data.id });
        const commentData = await getCommentByUUID(uuid);
        if (userDataId != commentData.id_user) {
            let postData = await getPostById(commentData.id_post);
            if (userDataId != postData.id_user) {
                return httpResponseForbidden(response, "you can only delete a comment if it is your own or if you are the owner of the post")
            }
        }
    } catch (error) {
        return httpResponseInternalServerError(response, error)
    }
    return next();
}

module.exports = {
    validationDoesExistCommentUUID, validationIsCommentAlreadyLikedByUser, validationIsCommentAlreadyDislikedByUser,
    validationDeleteCommentIfOwner
}