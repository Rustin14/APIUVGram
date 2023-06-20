const { sequelize } = require("../database/connectionDatabaseSequelize");
const { URLRecover } = require("../models/URLRecover");
const { v4: uuidv4 } = require("uuid");
const { ActionURLRecoverType } = require("../models/enum/ActionURLRecoverType");
const { encryptAES, decryptAES } = require("../helpers/aes-encryption");

const decryptURI = async (uri) => {
    let parameters;
    let uuid;
    let idUser;
    let data;
    try {
        uuid = (uri.uuid) ? decryptAES(decodeURIComponent(uri.uuid)) : null;
        idUser = (uri.id) ? decodeURIComponent(uri.id) : null;
        data = (uri.data) ? JSON.parse(decryptAES(decodeURIComponent(uri.data))) : null;
    } catch (error) {
        throw new Error(error);
    }
    parameters = {
        uuid, idUser, data
    }
    return parameters;
}

/**
 * Generate a URL as verification to change for a new email.
 * This creates an URL and a row in database, the URL contains 
 * id_user, newEmail and UUID encrypted with AES.
 * @param {*} id_user the userID who need change email
 * @param {*} newEmail the newEmail which will replace the old one.
 * @returns URL or null
 */
const generateURLToChangeEmailOnConfirmation = async (id_user, newEmail) => {
    let url;
    const t = await sequelize.transaction();
    let data;
    try {
        data = await URLRecover.create({
            uuid: uuidv4(),
            action: ActionURLRecoverType.CONFIRM_EMAIL,
            id_user,
        }, { transaction: t });
        let payload = { newEmail: newEmail }
        url = `${getServerURLAddress()}/accounts/verification/url/${encodeURIComponent(ActionURLRecoverType.CONFIRM_EMAIL.toLowerCase())}?uuid=${encodeURIComponent(encryptAES(data.uuid))}&id=${encodeURIComponent(id_user)}&data=${encodeURIComponent(encryptAES(JSON.stringify(payload)))}`;
        await t.commit();
    } catch (error) {
        await t.rollback();
        throw new Error(error);
    }
    return url;
}

/**
 * Generate a URL as verification to update forgotten password
 * @param {*} id_user id_user that forgot the password
 * @param {*} emailOrUsername emailorUsername 
 * @returns URL or null
 */
const generateURLToUpdatePasswordOnConfirmation = async (id_user, emailOrUsername) => {
    let url;
    const t = await sequelize.transaction();
    let data;
    try {
        data = await URLRecover.create({
            uuid: uuidv4(),
            action: ActionURLRecoverType.CHANGE_PASSWORD,
            id_user,
        }, { transaction: t });
        let payload = { emailOrUsername: emailOrUsername }
        url = `${getServerWebAddress()}/accounts/verification/url/${encodeURIComponent(ActionURLRecoverType.CHANGE_PASSWORD.toLowerCase())}?uuid=${encodeURIComponent(encryptAES(data.uuid))}&id=${encodeURIComponent(id_user)}&data=${encodeURIComponent(encryptAES(JSON.stringify(payload)))}`;
        await t.commit();
    } catch (error) {
        await t.rollback();
        throw new Error(error);
    }
    return url;
}

/**
 * It only returns a URL to redirect to change password route
 * @param {*} uuid uuid of URLRecover table of specific user
 * @param {*} uuid the user id
 * @returns url or null
 */
const createURLRedirectionToChangePasswordRoute = (uuid, id_user) => {
    let url;
    try {
        url = `${getServerURLAddress()}/accounts/password/reset/confirmation?uuid=${encodeURIComponent(encryptAES(uuid))}&id=${encodeURIComponent(id_user)}`;
    } catch (error) {
        throw new Error(error);
    }
    return url;
}

/**
 * Remove URL Verification by user ID
 * @param {*} id_user the user id to remove the URL verification
 * @returns true if was removed otherwise false
 */
const removeURLVerification = async (id_user) => {
    let isRemoved = false;
    const t = await sequelize.transaction();
    try {
        let data = await URLRecover.destroy({
            where: { id_user }
        }, { transaction: t });
        await t.commit();
        if (data === 1) {
            isRemoved = true;
        }
    } catch (error) {
        await t.rollback();
        throw new Error(error);
    }
    return isRemoved;
}

/**
 * Decode URL Data and retrieve data from database
 * @param {*} uri the uri to retrieve and deocde
 * @returns JSON that contains uuid, idUser, data from URI and URLRecover attributes.
 */
const getDataURLRecover = async (uri) => {
    let dataURL;
    try {
        let uriData = await decryptURI(uri);
        let result = await URLRecover.findOne({
            where: {
                uuid: uriData.uuid,
                id_user: uriData.idUser
            }, raw: true
        });
        if (result) {
            dataURL = { uuid: result.uuid, idUser: result.id_user, data: uriData.data };
        }
    } catch (error) {
        throw new Error(error);
    }
    return dataURL;
}

/**
 * Get URLRecover data from database
 * @param {*} uuid uuid registered
 * @returns JSON that contains uuid, id_user, action and token
 */
const getDataURLRecoverByUUID = async (uuid) => {
    let dataURL;
    try {
        let result = await URLRecover.findOne({ where: { uuid }, raw: true });
        if (result) {
            dataURL = { ...result };
        }
    } catch (error) {
        throw new Error(error);
    }
    return dataURL;
}

/**
 * Get URLRecover data from database
 * @param {*} id_user user id to get data
 * @returns JSON that contains uuid, id_user, action and token
 */
const getDataURLByIdUser = async (id_user) => {
    let dataURL;
    try {
        let result = await URLRecover.findOne({ where: { id_user }, raw: true });
        if (result) {
            dataURL = { ...result };
        }
    } catch (error) {
        throw new Error(error);
    }
    return dataURL;
}

/**
 * Check if URL Verification was generated before by id_user
 * @param {*} id_user the user id which need to be verified.
 * @returns true is already generated otherwise false.
 */
const doesURLVerificationAlreadyGenerated = async (id_user) => {
    let isAlreadyGenerated = false;
    try {
        let result = await URLRecover.findOne({ where: { id_user }, raw: true });
        isAlreadyGenerated = (result != null);
    } catch (error) {
        throw new Error(error);
    }
    return isAlreadyGenerated;
}


const createURLResource = async (id_user, id_post, filename) => {
    let url;

    let fileExtension = filename.split(".")[1];
    let contentType;
    if (fileExtension === "mp4" || fileExtension === "quicktime") {
        contentType = `video/${fileExtension}`;
    } else {
        contentType = `image/${fileExtension}`;
    }
    let payload = {
        idUser: id_user,
        filename: filename,
        idPost: id_post,
        contentType: contentType
    }
    try {
        url = `${getServerURLAddress()}/resources/post-files?data=${encodeURIComponent(encryptAES(JSON.stringify(payload)))}`;
    } catch (error) {
        throw error;
    }
    return url;
}

const getURLResourceData = async (url) => {
    let result;
    try {
        let data = (url.data) ? JSON.parse(decryptAES(decodeURIComponent(url.data))) : null;
        result = {
            ...data
        }
    } catch (error) {
        throw new Error(error);
    }

    return result;
}

const getServerURLAddress = () => {
    let address = `${process.env.SV_ADDRESS}`;
    if (address) {
        if (address.charAt(address.length - 1) == "/") {
            address = address.slice(0, address.length - 1);
        }
    }
    return address;
}

const getServerWebAddress = () => {
    let address = `${process.env.WEB_SV_ADDRESS}`;
    if (address) {
        if (address.charAt(address.length - 1) == "/") {
            address = address.slice(0, address.length - 1);
        }
    }
    return address;
}



module.exports = {
    generateURLToChangeEmailOnConfirmation, getDataURLRecover, doesURLVerificationAlreadyGenerated,
    removeURLVerification, generateURLToUpdatePasswordOnConfirmation, getDataURLByIdUser, getDataURLRecoverByUUID,
    createURLRedirectionToChangePasswordRoute, createURLResource, getURLResourceData, getServerURLAddress,
    getServerWebAddress
}