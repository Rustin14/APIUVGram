const crypto = require('crypto');

function encryptAES(plainText) {
    if (!plainText) {
        return "";
    }
    const { AES_SECRET_KEY } = process.env;
    const cipher = crypto.createCipheriv("aes-256-ecb", AES_SECRET_KEY, null);
    return Buffer.concat([cipher.update(plainText), cipher.final()]).toString("base64");
}

function decryptAES(cipherText) {
    const { AES_SECRET_KEY } = process.env;
    let data;
    if (!cipherText) {
        return "";
    }
    try {
        data = [];
        let decipher = crypto.createDecipheriv('aes-256-ecb', AES_SECRET_KEY, null);
        decipher.setAutoPadding(true);
        data.push(decipher.update(cipherText, 'base64', 'utf8'));
        data.push(decipher.final('utf8'));
    } catch (error) {
        throw new Error(error);
    }
    return data.join('');
}

module.exports = { encryptAES, decryptAES }