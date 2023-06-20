const { sequelize } = require("../database/connectionDatabaseSequelize");
const { generateRefreshToken: generateRefreshTokenHelper, generateAccessToken: generateAcessTokenHelper,
    addToken: addTokenHelper, removeTokenByJTI, verifyToken: verifyTokenHelper,
    TOKEN_STATE, TOKEN_TYPE, getTokenValueRedis } = require("../helpers/token");
const { Session } = require("../models/Session");

const saveSessionTokenInDatabase = async (id_user, jti, device_info) => {
    let isSaved = false;
    const t = await sequelize.transaction();
    try {
        await Session.create({
            id_user,
            token: jti,
            device: device_info
        }, { transaction: t });
        await t.commit();
        isSaved = true;
    } catch (error) {
        await t.rollback();
        throw new Error(error);
    }
    return isSaved;
};

const deleteSessionInDbByRefreshJTI = async (refreshTokenJTI) => {
    let isRemoved = false;
    const t = await sequelize.transaction();
    try {
        await Session.destroy({
            where: {
                token: refreshTokenJTI
            }
        }, { transaction: t });
        await t.commit();
        isRemoved = true;
    } catch (error) {
        await t.rollback();
        throw new Error(error);
    }
    return isRemoved;
};



/**
* Check that the token has the VALID status and TokenType 
* @param {*} token token to be verified.
* @param {*} tokenType type of token expected
* @returns the actual value from redis database (VALID|INVALID|NILL|Undefined|null)
*/
const getTokenExist = async (token, tokenType) => {
    let value;
    let tokenData;
    try {
        tokenData = await verifyToken(token);
    } catch (error) {
        throw new Error(error.message);
    }
    if (!tokenData) throw new Error(`${tokenType} does not exist`);
    if (tokenType == TOKEN_TYPE.ACCESS) {
        let hasRefreshToken = await getTokenValueRedis(tokenData.refreshTokenJti);
        if (hasRefreshToken == null || (hasRefreshToken.split(" ")[0] == TOKEN_STATE.INVALID)) {
            throw new Error(`refreshToken of accessToken has expired`);
        }
    }
    if (tokenData.tokenType != tokenType) throw new Error(`you must provide a token of type ${tokenType}`);
    try {
        value = await getTokenValueRedis(tokenData.jti);
        if (!value || value == TOKEN_STATE.NIL) {
            throw (`${tokenType} does not exist`);
        }
    } catch (error) {
        throw new Error(error, `${tokenType} not found`)
    }

    if (value.split(" ")[0] == TOKEN_STATE.INVALID) {
        throw new Error(`${tokenType} has expired`)
    }
    return value;
};

/**
 * It generates the accessToken and refreshToken and save Session into database
 * @param {*} userId data to be save into payload.
 * @param {*} userRole data to be save into payload.
 * @param {*} session data of device who log in to system.
 * @returns the accessToken and refreshToken as JSON object.
 */
const generateTokens = async (userId, userRole, device_info) => {
    let accessToken;
    let refreshToken;
    try {
        let payloadAccessToken = {
            id: userId,
            userRole,
        };
        refreshToken = await generateRefreshTokenHelper(payloadAccessToken);
        accessToken = await generateAcessTokenHelper(payloadAccessToken, refreshToken.jti);
        await addTokenHelper(refreshToken.token, refreshToken.jti);
        await addTokenHelper(accessToken.token, accessToken.jti);
        await saveSessionTokenInDatabase(userId, refreshToken.jti, device_info);
    } catch (error) {
        removeTokenByJTI(accessToken.jti);
        removeTokenByJTI(refreshToken.jti);
        throw new Error(error);
    }
    let tokensCreated = {
        refreshToken: refreshToken.token,
        accessToken: accessToken.token
    }
    return tokensCreated;
};

/**
 * It generates a new accessToken using a refreshtoken identifier.
 * @param {*} userId data to be save into payload.
 * @param {*} userRole data to be save into payload.
 * @param {*} refreshTokenJti the identifier of refreshToken
 * @returns the new accessToken as JSON object.
 */
const refreshAccessToken = async (userId, userRole, refreshTokenJti) => {
    let accessToken;
    try {
        let payloadAccessToken = {
            userId,
            userRole,
        };
        accessToken = await generateAcessTokenHelper(payloadAccessToken, refreshTokenJti);
        await addTokenHelper(accessToken.token, accessToken.jti);
    } catch (error) {
        removeTokenByJTI(accessToken.jti);
        throw new Error(error);
    }
    let tokenCreated = {
        accessToken
    }
    return tokenCreated;
};

/**
 * Remove token from redis server
 * This method doesnt remove the token from jwt library (because is not possible)
 * instead it removes the redis token, which it's where we can validate if token is valid
 * or it's expired.
 * @param {*} token the token (can be accessToken or refreshToken) to remove from redis
 */
const removeToken = async (token) => {
    let isRemoved;
    try {
        let tokenData = await verifyToken(token);
        await removeTokenByJTI(tokenData.jti);
        isRemoved = true;
    } catch (error) {
        throw new Error(error);
    }
    return isRemoved;
};

/**
 * Delete a specific session including both tokens and session db row.
 * @param {*} accessToken the actual device accessToken
 * @returns true if was removed otherwise false
 */
const deleteAllSessionByAccessToken = async (accessToken) => {
    let isRemoved;
    try {
        let refreshTokenJTI = (await verifyToken(accessToken)).refreshTokenJti;
        await deleteSessionInDbByRefreshJTI(refreshTokenJTI);
        await removeTokenByJTI(refreshTokenJTI);
        await removeToken(accessToken);
        isRemoved = true;
    } catch (error) {
        throw new Error(error);
    }
    return isRemoved;
}

/**
 * Verify if token exist return the decoded data.
 * @param {*} token the token to be verified.
 * @returns the data decoded from JTW
 */
const verifyToken = async (token) => {
    let tokenVerified;
    try {
        tokenVerified = await verifyTokenHelper(token);
    } catch (error) {
        throw new Error(error);
    }
    return tokenVerified;
};

/**
 * Refresh login of user removing old access token
 * @param {*} accessToken the accesstoken that will be removed
 * @param {*} id_user the actual user data
 * @param {*} userRole the actual user data
 * @returns accessToken regenerated
 */
const refreshLoginAndRemoveOldAccessToken = async (accessToken, id_user, userRole) => {
    let newAccessToken;
    try {
        let refresTokenJTI = (await verifyToken(accessToken)).refreshTokenJti;
        newAccessToken = await refreshAccessToken(id_user, userRole, refresTokenJTI);
        await removeTokenByJTI(accessToken);
    } catch (error) {
        throw error;
    }
    return newAccessToken;
}

/**
 * Delete refresh token from db and redis.
 * @param {*} id_user the user id to remove sessions
 * @returns true is all session was removed
 */
const deleteAllSessionsByUserId = async (id_user) => {
    let isAllSessionRemoved = false;
    try {
        let result = await Session.findAll({
            where: {
                id_user
            },
        });
        if (result.length !== 0) {
            await Promise.all(result.map(async (session) => {
                try {
                    await removeTokenByJTI(session.token);
                    await session.destroy();
                } catch (error) {
                    throw error;
                }
            }));
            isAllSessionRemoved = true;
        }
    } catch (error) {
        throw error;
    }
    return isAllSessionRemoved
}

module.exports = {
    refreshAccessToken, generateTokens, removeToken,
    verifyToken, getTokenExist, TOKEN_STATE, TOKEN_TYPE,
    refreshLoginAndRemoveOldAccessToken, deleteAllSessionByAccessToken, deleteAllSessionsByUserId
}