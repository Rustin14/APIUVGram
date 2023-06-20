const { verifyToken } = require("../dataaccess/tokenDataAccess");
const { isUserFollowedByUser, getIdByUsername, isUsernameRegistered, getActualPrivacyType, isRequestFollowerSent } = require("../dataaccess/userDataAccess");
const { httpResponseInternalServerError, httpResponseForbidden } = require("../helpers/httpResponses");
const { PrivacyType } = require("../models/enum/PrivacyType");

const isUserAlreadyFollowedByUser = async (idUserFollower, idUserFollowed) => {
    let isFollowed = false;
    try {
        isFollowed = await isUserFollowedByUser(idUserFollower, idUserFollowed);
    } catch (error) {
        throw new Error(error);
    }
    return isFollowed;
}

const validationRejectOnUsernameNotRegistered = async (request, response, next) => {
    let { username } = request.body;
    if (!username) username = request.params.username;
    try {
        let isRegistered = await isUsernameRegistered(username);
        if (!isRegistered) {
            return httpResponseForbidden(response, "username does not exist");
        }
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return next();
}

const validationFollowingUser = async (request, response, next) => {
    const token = (request.headers.authorization).split(" ")[1];
    let idUserFollowed;
    let idUserFollower;
    let { username } = request.body;
    try {
        idUserFollower = await verifyToken(token).then(data => { return data.id });
        idUserFollowed = await getIdByUsername(username).then(id => { return id });
        if (idUserFollowed == idUserFollower) {
            return httpResponseForbidden(response, "you can not follow yourself");
        }
        let isAlreadyFollowed = await isUserAlreadyFollowedByUser(idUserFollower, idUserFollowed);
        if (isAlreadyFollowed) {
            return httpResponseForbidden(response, "user is already followed");
        }
        let isFolloweRequestSent = await isRequestFollowerSent(idUserFollower, idUserFollowed);
        if (isFolloweRequestSent) {
            return httpResponseForbidden(response, "follower request is already sent to user")
        }
    } catch (error) {
        return httpResponseInternalServerError(error);
    }
    return next();
}

const validationUnfollowingUser = async (request, response, next) => {
    const token = (request.headers.authorization).split(" ")[1];
    let idUserFollowed;
    let idUserFollower;
    let { username } = request.body;
    try {
        idUserFollower = await verifyToken(token).then(data => { return data.id });
        idUserFollowed = await getIdByUsername(username).then(id => { return id });
        if (idUserFollowed == idUserFollower) {
            return httpResponseForbidden(response, "you can not unfollow yourself");
        }
        let isRequestFollowerNotSent = !(await isRequestFollowerSent(idUserFollower, idUserFollowed));
        let isAlreadyUnfollowed = !(await isUserAlreadyFollowedByUser(idUserFollower, idUserFollowed));
        if (isAlreadyUnfollowed && isRequestFollowerNotSent) {
            return httpResponseForbidden(response, "user is already unfollowed");
        }
    } catch (error) {
        return httpResponseInternalServerError(error);
    }
    return next();
}

const validationRemoveUserFromFollowers = async (request, response, next) => {
    const token = (request.headers.authorization).split(" ")[1];
    let { username } = request.body;
    try {
        let idUserFollowed = await verifyToken(token).then(data => { return data.id });
        let idUserFollower = await getIdByUsername(username).then(id => { return id });
        if (idUserFollowed == idUserFollower) {
            return httpResponseForbidden(response, "you can not delete yourself from your followers");
        }
        let isUserAlreadyFollowed = await isUserAlreadyFollowedByUser(idUserFollower, idUserFollowed);
        if (!isUserAlreadyFollowed) {
            return httpResponseForbidden(response, `${username} is not following you`);
        }
    } catch (error) {
        return httpResponseInternalServerError(error);
    }
    return next();
}

const validationBlockingUser = async (request, response, next) => {
    const token = (request.headers.authorization).split(" ")[1];
    let idUserBlocked;
    let idUserBlocker;
    let { username } = request.body;
    try {
        idUserBlocker = await verifyToken(token).then(data => { return data.id });
        idUserBlocked = await getIdByUsername(username).then(id => { return id });
        if (idUserBlocked == idUserBlocker) {
            return httpResponseForbidden(response, "you can not block yourself");
        }
        let isAlreadyBlocked = await isUserAlreadyBlockedByUser(idUserBlocker, idUserBlocked);
        if (isAlreadyBlocked) {
            return httpResponseForbidden(response, "user is already blocked");
        }
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return next();
}

const validationUnblockingUser = async (request, response, next) => {
    const token = (request.headers.authorization).split(" ")[1];
    let { username } = request.body;
    try {
        let idUserBlocker = await verifyToken(token).then(data => { return data.id });
        let idUserBlocked = await getIdByUsername(username).then(id => { return id });
        if (idUserBlocked == idUserBlocker) {
            return httpResponseForbidden(response, "you can not unblock yourself");
        }
        let isAlreadyBlocked = !(await isUserAlreadyBlockedByUser(idUserBlocker, idUserBlocked));
        if (isAlreadyBlocked) {
            return httpResponseForbidden(response, "user is already unblocked");
        }
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return next();
};

const validationAcceptOrDenyFollowerRequest = async (request, response, next) => {
    const token = (request.headers.authorization).split(" ")[1];
    let { username } = request.body;
    try {
        let idFollower = await getIdByUsername(username).then(id => { return id });
        let userDataId = await verifyToken(token).then(data => { return data.id });
        if (userDataId == idFollower) {
            return httpResponseForbidden(response, "you can not accept or deny follower request from yourself");
        }
        let isAlreadyAccepted = await isUserAlreadyFollowedByUser(idFollower, userDataId);
        if (isAlreadyAccepted) {
            return httpResponseForbidden(response, "user is already accepted");
        }
        let isRequestSent = await isRequestFollowerSent(idFollower, userDataId);
        if (!isRequestSent) {
            return httpResponseForbidden(response, `there is no follower request from ${username}`);
        }
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return next();
};

const validationDoesUserBlocked = async (request, response, next) => {
    const token = (request.headers.authorization).split(" ")[1];
    let ownerResourceUserId;
    let username = request.body.username;
    if (!username) username = request.params.username;
    if (!username) username = response.locals.username;
    if (!username) ownerResourceUserId = response.locals.ownerResourceUserId;
    let result;
    try {
        const userData = await verifyToken(token);
        if (!ownerResourceUserId) {
            ownerResourceUserId = await getIdByUsername(username);
        }
        if (userData.id == ownerResourceUserId) {
            return next();
        }
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }

    return next();
}

const validationDoesUserIsPrivateAndUnfollowedByActualUser = async (request, response, next) => {
    const token = (request.headers.authorization).split(" ")[1];
    let ownerResourceUserId;
    let username = request.body.username;
    if (!username) username = request.params.username;
    if (!username) username = response.locals.username;
    if (!username) ownerResourceUserId = response.locals.ownerResourceUserId;

    try {
        const userData = await verifyToken(token);
        if (!ownerResourceUserId) {
            ownerResourceUserId = await getIdByUsername(username);
        }
        if (userData.id == ownerResourceUserId) {
            return next();
        }
        let isAlreadyFollowed = await isUserFollowedByUser(userData.id, ownerResourceUserId);
        if (isAlreadyFollowed) {
            return next();
        }
        let isUserPrivate = await getActualPrivacyType(ownerResourceUserId);
        if (!isUserPrivate || isUserPrivate === PrivacyType.PRIVATE) {
            return httpResponseForbidden(response, `user is ${PrivacyType.PRIVATE}`);
        }
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return next();
}

module.exports = {
    validationFollowingUser, validationUnfollowingUser, validationBlockingUser,
    validationUnblockingUser, validationRejectOnUsernameNotRegistered, validationDoesUserBlocked,
    validationDoesUserIsPrivateAndUnfollowedByActualUser, validationAcceptOrDenyFollowerRequest,
    validationRemoveUserFromFollowers
}