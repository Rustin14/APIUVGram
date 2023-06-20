const { sendEmailCodeVerification, sendEmailChangeURLConfirmation, sendEmailPasswordURLConfirmation } = require("../dataaccess/mailDataAccess");
const { verifyToken, deleteAllSessionsByUserId } = require("../dataaccess/tokenDataAccess");
const { generateURLToChangeEmailOnConfirmation, doesURLVerificationAlreadyGenerated, removeURLVerification, generateURLToUpdatePasswordOnConfirmation } = require("../dataaccess/urlRecoverDataAccess");
const { deleteUserByUsername, createUser, generateCodeVerification, removeVerificationCode,
    getAllUsers: getAllUsersDataAccess, changePassword: changePasswordUserDataAccess, updateUserPersonalData, updateAdministratorData, updateModeratorData, getAccountLoginDataById, updateBusinessData, getAccountLoginData, changeUserRoleType, changePrivacyTypeUser, acceptAllFollowerRequestById, acceptFollowerRequestByUserId, getIdByUsername, denyFollowerRequestByUserId, getAllAccountData } = require("../dataaccess/userDataAccess");
const { httpResponseInternalServerError, httpResponseOk, httpResponseForbidden } = require("../helpers/httpResponses");
const { logger } = require("../helpers/logger");
const { PrivacyType } = require("../models/enum/PrivacyType");
const { UserRoleType } = require("../models/enum/UserRoleType");

const addUser = async (request, response) => {
    const { password, email, name, presentation, username, phoneNumber, birthdate } = request.body;
    let user = {
        password,
        email,
        name,
        presentation,
        username,
        phoneNumber,
        birthdate
    }
    let message;
    try {
        message = await createUser(user);
        await removeVerificationCode(username);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, message)
};

const updateUser = async (request, response) => {
    let isUpdated = false;
    let newAccessToken;
    let emailMessage;
    const { email, name, presentation, username, phoneNumber, birthdate } = request.body;
    const accessToken = (request.headers.authorization).split(" ")[1];
    let accessTokenData;
    let oldUserData;
    try {
        accessTokenData = await verifyToken(accessToken);
        let basicData = { name, presentation, username, phoneNumber, email, birthdate };
        let idUser = accessTokenData.id;
        let userRole = accessTokenData.userRole;
        oldUserData = await getAccountLoginDataById(idUser);
        if (userRole == UserRoleType.PERSONAL) {
            const { gender, idCareer } = request.body;
            let personalData = { gender, idCareer }
            isUpdated = await updateUserPersonalData(basicData, personalData, idUser);
        } else if (userRole == UserRoleType.BUSINESS) {
            const { category, city, postalCode, postalAddress, contactEmail, phoneContact, organizationName } = request.body;
            let businessData = { category, city, postalCode, postalAddress, contactEmail, phoneContact, organizationName };
            isUpdated = await updateBusinessData(basicData, businessData, idUser);
        } else if (userRole == UserRoleType.MODERATOR) {
            const { updateDate } = request.body;
            let moderatorData = { updateDate }
            isUpdated = await updateModeratorData(basicData, moderatorData, idUser);
        } else if (userRole == UserRoleType.ADMINISTRATOR) {
            const { createdTime } = request.body;
            let adminData = { createdTime }
            isUpdated = await updateAdministratorData(basicData, adminData, idUser);
        }
    } catch (error) {
        throw httpResponseInternalServerError(response, error);
    }
    try {
        if (isUpdated && email != oldUserData.email) {
            let isAlreadyURLGenerated = await doesURLVerificationAlreadyGenerated(oldUserData.id);
            if (!isAlreadyURLGenerated) {
                let url = await generateURLToChangeEmailOnConfirmation(oldUserData.id, email);
                if (url) {
                    let result = await sendEmailChangeURLConfirmation(url, email);
                    if (!result) {
                        throw new Error("can not send email");
                    }
                    emailMessage = "a confirmation address has been sent to the new email";
                } else {
                    throw new Error("can not generate a new url");
                }
            } else {
                emailMessage = "please wait 5 minutes to generate another confirmation address";
            }
        }
    } catch (error) {
        await removeURLVerification(oldUserData.id);
        logger.warn(error);
        emailMessage = "cannot change email, try later";
    }
    const payload = { isUpdated, newAccessToken, emailMessage }
    return httpResponseOk(response, payload);
};

const changePassword = async (emailOrUsername, newPassword) => {
    let isChanged = false;
    try {
        isChanged = await changePasswordUserDataAccess(emailOrUsername, newPassword);
    } catch (error) {
        throw new Error(error);
    }
    return isChanged;
};

const removeUserByUsername = async (request, response) => {
    const { username } = request.body;
    let message;
    try {
        message = await deleteUserByUsername(username);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, message)
};

const createURLVerification = async (request, response) => {
    let { emailOrUsername } = request.body;
    let message;
    let userData
    try {
        userData = await getAccountLoginData(emailOrUsername);
        let urlResult = await generateURLToUpdatePasswordOnConfirmation(userData.id, emailOrUsername);
        if (urlResult) {
            let emailResult = await sendEmailPasswordURLConfirmation(urlResult, userData.email);
            if (!emailResult) {
                throw new Error("can not send email");
            }
            message = "a confirmation address has been sent to the new email";
        } else {
            throw new Error("can not generate a new url");
        }
    } catch (error) {
        await removeURLVerification(userData.id);
        logger.warn(error);
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, message);
}

const createVerificationCode = async (request, response) => {
    let { username, email } = request.body;
    let isGenerated = false;
    let verificationCode;
    try {
        verificationCode = await generateCodeVerification(username);
        if (verificationCode) {
            let isSentToEmail = await sendEmailCodeVerification(verificationCode, email);
            isGenerated = isSentToEmail;
        }
    } catch (error) {
        if (verificationCode) await removeVerificationCode(verificationCode);
        return httpResponseInternalServerError(response, error);
    }
    if (!isGenerated) {
        return httpResponseForbidden(response, "can not generate verification code, try later");
    }
    return httpResponseOk(response, isGenerated);
};

const getAllUsers = async (request, response) => {
    let users;
    try {
        users = await getAllUsersDataAccess();
    } catch (error) {
        return httpResponseInternalServerError(error);
    }
    return httpResponseOk(response, users);
};

const getUserAccountData = async (request, response) => {
    const token = (request.headers.authorization).split(" ")[1];
    let userInfo;
    try {
        let userData = await verifyToken(token);
        userInfo = await getAllAccountData(userData.id);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, userInfo);
}

module.exports = {
    addUser, removeUserByUsername, createVerificationCode,
    getAllUsers, updateUser,createURLVerification,
    getUserAccountData
}