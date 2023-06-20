const jwt = require('jsonwebtoken')
const { redisClient } = require("../database/connectionRedis");
const { v4: uuidv4 } = require("uuid");

const EXPIRATION_TIME = {
    INSTANT: process.env.EXPIRATION_TIME_INSTANT,
    LONG: process.env.EXPIRATION_TIME_LONG_TIME
};

const TOKEN_STATE = {
    INVALID: "INVALID",
    VALID: "VALID",
    NIL: "NIL"
};

const TOKEN_TYPE = {
    REFRESH: "refreshToken",
    ACCESS: "accessToken"
};

/**
 * This method generate and signs a token of type refreshToken.
 * @param {*} payload data that must contain an identifier (id), must be the same as the accesstokens payload.
 * @returns the token generated with jti uuidv4 identifier.
 */
const generateRefreshToken = async (payload) => {
    const jti = uuidv4();
    const refreshTokenPayload = {
        id: payload.id,
        tokenType: TOKEN_TYPE.REFRESH
    }
    let refreshToken = jwt.sign(
        refreshTokenPayload,
        process.env.TOKEN_SECRET, {
        expiresIn: EXPIRATION_TIME.LONG,
        jwtid: jti
    });
    return { token: refreshToken, jti }
};

/**
 * This method generate and signs a token of type accessToken
 * and it's need a reference to a refreshToken.
 * @param {*} payload data that contain user data
 * @param {*} refreshTokenJti must be the refreshToken id (jti).
 * @returns the token generated with jti uuidv4 identifier.
 */
const generateAccessToken = async (payload, refreshTokenJti) => {
    const jti = uuidv4();
    const accessTokenPayload = {
        ...payload,
        refreshTokenJti,
        tokenType: TOKEN_TYPE.ACCESS,
    };
    const accessToken = jwt.sign(
        accessTokenPayload,
        process.env.TOKEN_SECRET, {
        expiresIn: EXPIRATION_TIME.INSTANT,
        jwtid: jti
    });
    return { token: accessToken, jti }
};

/**
 * Verify the if JWT exists and decode the JTW data.
 * @param {*} token the token provided.
 * @returns the JTW decoded data.
 */
const verifyToken = async (token) => {
    const tokenVerified = jwt.verify(token, process.env.TOKEN_SECRET);
    return tokenVerified;
};

/**
 * Add token to REDIS server.
 * @param {*} token the value that will be stored as value.
 * @param {*} jti that will act as the key.
 */
const addToken = async (token, jti) => {
    const check = await redisClient.EXISTS(jti);
    if (check === 1) {
        return;
    }
    const value = `${TOKEN_STATE.VALID} ${token}`
    await redisClient.SET(jti, value);
    const payload = await verifyToken(token);
    await redisClient.EXPIREAT(jti, +payload.exp);
    return;
};

/**
 * Get token value from REDIS server
 * @param {*} jti as key.
 * @returns value of key in redis
 */
const getTokenValueRedis = async (jti) => {
    const status = await redisClient.GET(jti);
    return status;
};

/**
 * Set the token value into invalid in REDIS server.
 * @param {*} token that will act as a key.
 * @param {*} jti the token jti value.
 */
const blacklistToken = async (token, jti) => {
    const value = `${TOKEN_STATE.INVALID} ${token}`
    const status = await redisClient.SET(jti, value);
    if (status == "nil") return;
    const payload = await verifyToken(token);
    await redisClient.EXPIREAT(jti, +payload.exp);
    return;
};

/**
 * Remove token from REDIS server.
 * @param {*} jti that will act as a key.
 */
const removeTokenByJTI = async (jti) => {
    return await redisClient.del(jti);
};

module.exports = {
    generateRefreshToken, generateAccessToken, verifyToken,
    addToken, getTokenValueRedis, blacklistToken,
    removeTokenByJTI, TOKEN_STATE, TOKEN_TYPE
}