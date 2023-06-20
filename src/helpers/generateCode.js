const crypto = require("crypto");
/**
 * Generate random code.
 * Max 64 characters allowed
 * @param {*} maxCharacters 64 max characters allowed.
 * @returns random code as String
 */
const generateRandomCode = (maxCharacters) => {
    if (maxCharacters > 64) {
        maxCharacters = 64;
    }
    const secret = Math.random().toString();
    const sha256hasher = crypto.createHmac("sha256", secret);
    const hash = sha256hasher.update("0239423095389112341209").digest("hex");
    return hash.slice(0, maxCharacters);
};

const generateRandomUUID = (maxCharacters) => {
    Buffer.from(Math.random().toString()).toString('base64').slice(0, maxCharacters);
    return generateRandomCode(maxCharacters);
}

module.exports = { generateRandomCode, generateRandomUUID }