const { isEducationalProgramRegistered } = require("../dataaccess/educationalProgramDataAccess");
const { verifyToken } = require("../dataaccess/tokenDataAccess");
const { isEmailRegistered, isUsernameRegistered, isVerificationCodeGenerated, doesVerificationCodeMatches,
    isOldPasswordValid, getAccountLoginData, getAccountLoginDataById, getActualPrivacyType } = require("../dataaccess/userDataAccess");
const { decryptAES } = require("../helpers/aes-encryption");
const { httpResponseInternalServerError, httpResponseOk, httpResponseForbidden, httpResponseUnauthorized } = require("../helpers/httpResponses");
const { CategoryType } = require("../models/enum/CategoryType");
const { GenderType } = require("../models/enum/GenderType");

const validationisEmailRegisteredWithNext = async (request, response, next) => {
    let isRegistered;
    try {
        const { email } = request.body;
        isRegistered = await isEmailRegistered(email);
    } catch (err) {
        return httpResponseInternalServerError(response, err);
    }
    if (isRegistered) {
        return httpResponseForbidden(response, { exist: isRegistered, message: "email is already registered" });
    } else {
        return next();
    }
};

const validationIsUsernameRegisteredWithNext = async (request, response, next) => {
    let isRegistered;
    try {
        const { username } = request.body;
        isRegistered = await isUsernameRegistered(username);
    } catch (err) {
        return httpResponseInternalServerError(response, err);
    }
    if (isRegistered) {
        return httpResponseForbidden(response, { exist: isRegistered, message: "username is already registered" });
    } else {
        return next();
    }
};

const validationIsEmailRegistered = async (request, response) => {
    let isRegistered;
    try {
        let { email } = request.body;
        if (!email) {
            email = request.params.email
            email = decodeURIComponent(email);
        }
        isRegistered = await isEmailRegistered(email);
    } catch (err) {
        return httpResponseInternalServerError(response, err);
    }
    let message;
    if (isRegistered) {
        message = "email is already registered";
    } else {
        message = "email is not registered";
    }
    return httpResponseOk(response, { exist: isRegistered, message });
};

const validationIsUsernameRegistered = async (request, response) => {
    let isRegistered;
    let { username } = request.body;
    if (!username) username = request.params.username;
    try {
        isRegistered = await isUsernameRegistered(username);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    let message;
    if (isRegistered) {
        message = "username is already registered";
    } else {
        message = "username is not registered";
    }
    return httpResponseOk(response, { exist: isRegistered, message });
};

const validationNotGeneratedVerificationCode = async (request, response, next) => {
    let { username } = request.body;
    let isGenerated;
    try {
        isGenerated = await isVerificationCodeGenerated(username);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    if (isGenerated) {
        return httpResponseForbidden(response, "wait to generate another verification code");
    }
    return next();
};

const validationVerificationCodeMatches = async (request, response, next) => {
    let { username, verificationCode } = request.body;
    let isValid = false;
    try {
        isValid = await doesVerificationCodeMatches(username, verificationCode);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    if (!isValid) {
        return httpResponseForbidden(response, "verification code is not valid");
    }
    return next();
};

const validationChangePasswordLoggedUser = async (request, response, next) => {
    const token = (request.headers.authorization).split(" ")[1];
    let { oldPassword } = request.body;
    let isValidOldPassword = false;
    try {
        let tokenDataId = await verifyToken(token).then(data => { return data.id });
        let userEmail = (await getAccountLoginDataById(tokenDataId)).email;
        isValidOldPassword = await isOldPasswordValid(oldPassword, userEmail);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    if (!isValidOldPassword) {
        return httpResponseForbidden(response, "the old password does not match actual password");
    }
    return next();
}

const validationEmailOrUsernameRejectOnNotExist = async (request, response, next) => {
    let { emailOrUsername } = request.body;
    let userData;
    try {
        userData = await getAccountLoginData(emailOrUsername);
        if (!userData) {
            return httpResponseForbidden(response, "username does not exist");
        }
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return next();
}

const validationUpdateEmailAndUsernameData = async (request, response, next) => {
    const token = (request.headers.authorization).split(" ")[1];
    const { username, email } = request.body;
    let tokenDataId = (await verifyToken(token)).id;
    let userData = await getAccountLoginDataById(tokenDataId);
    if (username && username != userData.username) {
        let doesExistAnotherUserWithSameUsername = await isUsernameRegistered(username);
        if (doesExistAnotherUserWithSameUsername) {
            return httpResponseForbidden(response, "the new username is already taken")
        }
    }
    if (email && email != userData.email) {
        let doesExistAnotherUserWithSameEmail = await isEmailRegistered(email);
        if (doesExistAnotherUserWithSameEmail) {
            return httpResponseForbidden(response, "the new email is already taken");
        }
    }
    return next();
};

const validationPersonalRoleData = async (request, response, next) => {
    const { gender, idCareer } = request.body;
    if (!Object.values(GenderType).includes(gender)) {
        return httpResponseForbidden(response, "gender provided does not exist");
    }
    let doesExistCareer = await isEducationalProgramRegistered(idCareer);
    if (!doesExistCareer) {
        return httpResponseForbidden(response, "idCareer provided does not exist");
    }
    return next();
};

const validationBusinessRoleData = async (request, response, next) => {
    const { category } = request.body;
    if (!Object.values(CategoryType).includes(category)) {
        return httpResponseForbidden(response, "category type provided does not exist");
    }
    return next();
};

const validationAdminRoleData = async (request, response, next) => {
    return next();
};

const validationModeratorRoleData = async (request, response, next) => {
    return next();
};

const validationSecretKey = async (request, response, next) => {
    const { key } = request.body;
    let isValidKey
    try {
        isValidKey = (decryptAES(key) == process.env.SERVER_KEY);
        if (!isValidKey) {
            return httpResponseUnauthorized(response);
        }
    } catch (error) {
        return httpResponseUnauthorized(response);
    }
    next();
};

const validationUserPrivacy = async (request, response, next) => {
    const token = (request.headers.authorization).split(" ")[1];
    const { privacy } = request.body;
    try {
        let userDataId = await verifyToken(token).then(data => { return data.id });
        let result = await getActualPrivacyType(userDataId);
        if (result == privacy) {
            return httpResponseForbidden(response, `you account is already: ${privacy}`);
        }
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    next();
};

module.exports = {
    validationisEmailRegisteredWithNext, validationIsUsernameRegisteredWithNext,
    validationIsUsernameRegistered, validationIsEmailRegistered, validationNotGeneratedVerificationCode,
    validationVerificationCodeMatches, validationChangePasswordLoggedUser, validationEmailOrUsernameRejectOnNotExist,
    validationUpdateEmailAndUsernameData, validationPersonalRoleData, validationAdminRoleData, validationModeratorRoleData,
    validationBusinessRoleData, validationSecretKey, validationUserPrivacy
}



