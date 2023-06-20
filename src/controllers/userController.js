const { deleteAllCommentsOfUserFromAllUserPost, deleteAllUserLikesFromUserComments, getCommentsCountById } = require("../dataaccess/commentDataAccess");
const { getAllPostFromUserId, deleteAllLikesOfUserFromAllPost, getIdPostByPostUUID, getPostFilenamesById, countPost } = require("../dataaccess/postDataAccess");
const { followUser: followUserUserDataAccess, getIdByUsername, unfollowUser: unfollowUserUserDataAccess, getFollowedByUser: getFollowedUsersOfUserUserDataAccess, getFollowersOfUser: getFollowersOfUserUserDataAccess, getUserProfile: getUserProfileUserDataAccess
    , blockUser: blockUserUserDataAccess, unblockUser: unblockUserUserDataAccess, deleteFollowerAndFollowing, getActualPrivacyType, sendRequestFollowToUser, getAllFollowerRequestByUserId, getAllBlockedUsers, isUserFollowedByUser, isRequestFollowerSent, getAllUsersByFilter } = require("../dataaccess/userDataAccess");
const { httpResponseOk, httpResponseInternalServerError } = require("../helpers/httpResponses");
const { logger } = require("../helpers/logger");
const { verifyToken } = require("../helpers/token");
const { PrivacyType } = require("../models/enum/PrivacyType");

const followUser = async (request, response) => {
    const token = (request.headers.authorization).split(" ")[1];
    let { username } = request.body;
    const idUserFollowed = await getIdByUsername(username).then(id => { return id });
    const idUserFollower = await verifyToken(token).then(data => { return data.id });
    let message;
    try {
        let userStateType = await getActualPrivacyType(idUserFollowed);
        if (userStateType == PrivacyType.PRIVATE) {
            let resultData = await sendRequestFollowToUser(idUserFollower, idUserFollowed);
            if (resultData) {
                message = `follower request sent to ${username}`
            } else {
                message = `can not send follower request to ${username}`
            }
        } else {
            let resultData = await followUserUserDataAccess(idUserFollower, idUserFollowed);
            if (resultData) {
                message = `you are now following to ${username}`
            } else {
                message = `can not follow to ${username}`
            }
        }
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, message);
};

const unfollowUser = async (request, response) => {
    const token = (request.headers.authorization).split(" ")[1];
    let { username } = request.body;
    const idUserFollowed = await getIdByUsername(username).then(id => { return id });
    const idUserFollower = await verifyToken(token).then(data => { return data.id });
    let message;
    try {
        message = await unfollowUserUserDataAccess(idUserFollower, idUserFollowed);
        if (message) {
            message = `you have unfollowed to ${username}`;
        }
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, message);
};

const deleteFollower = async (request, response) => {
    const token = (request.headers.authorization).split(" ")[1];
    let { username } = request.body;
    const idUserFollower = await getIdByUsername(username).then(id => { return id });
    const userDataId = await verifyToken(token).then(data => { return data.id });
    let message;
    try {
        message = await unfollowUserUserDataAccess(idUserFollower, userDataId);
        if (message) {
            message = `you have removed ${username} from your followers`;
        }
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, message);
};

const getFollowedByUser = async (request, response) => {
    let username = request.params.username;
    const idUser = await getIdByUsername(username).then(id => { return id });
    let message;
    try {
        message = await getFollowedUsersOfUserUserDataAccess(idUser);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, message);
};

const getFollowersOfUser = async (request, response) => {
    let username = request.params.username;
    const idUser = await getIdByUsername(username).then(id => { return id });
    let message;
    try {
        message = await getFollowersOfUserUserDataAccess(idUser);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, message);
};

const getProfileOfUser = async (request, response) => {
    let username = request.params.username;
    let user;
    let idUser;
    try {
        idUser = await getIdByUsername(username).then(id => { return id });
        user = await getUserProfileUserDataAccess(idUser);
        user.followed = (await getFollowedUsersOfUserUserDataAccess(idUser)).length;
        user.followers = (await getFollowersOfUserUserDataAccess(idUser)).length;
        user.privacyType = await getActualPrivacyType(idUser);
        user.postsCreated = await countPost(idUser);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    let accessToken = request.headers.authorization;
    let userLoggedId;
    if (accessToken != null) {
        try {
            userLoggedId = await verifyToken(accessToken.split(" ")[1]).then(data => { return data.id });
            user.isFollowed = await isUserFollowedByUser(userLoggedId, idUser);
            user.isFollowerRequestSent = await isRequestFollowerSent(userLoggedId, idUser);
            user.isFollower = await isUserFollowedByUser(idUser, userLoggedId);
            user.hasSubmittedFollowerRequest = await isUserFollowedByUser(idUser, userLoggedId);
        } catch (error) {
            logger.info(error);
        }
    }
    try {
        if (!user.isBlocked) {
            if (PrivacyType.PUBLIC === user.privacyType || user.isFollowed || idUser == userLoggedId) {
                user.posts = await getAllPostFromUserId(idUser);
                await Promise.all(user.posts.map(async function (post) {
                    let postId = await getIdPostByPostUUID(post.uuid);
                    if (!postId) {
                        post.comments = 0;
                        return;
                    }
                    post.comments = await getCommentsCountById(postId);
                    post.files = await getPostFilenamesById(post.id_user, post.id);
                    delete post["id_user"];
                    delete post["id"];
                }));
            }
        } else {
            user.followers = 0;
            user.followed = 0;
            user.postsCreated = 0;
        }
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, user);
};

const findByFilter = async (request, response) => {
    const filter = request.params.filter;
    let users = [];
    try {
        users = await getAllUsersByFilter(filter);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, users);
};

module.exports = {
    followUser, unfollowUser, getFollowedByUser,
    getFollowersOfUser, getProfileOfUser, deleteFollower,
    findByFilter
}