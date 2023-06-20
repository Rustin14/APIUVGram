const { mailer } = require("../database/connetionEmail");
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { TEST_NODEMAILER_HOST, TEST_NODEMAILER_PORT_APIV2 } = process.env;

/**
 * Send code verification URL confirmation to an specific email
 * @param {*} url the url that was generated.
 * @param {*} to email address who will receive the mail
 * @returns true if sent otherwise false
 */
const sendEmailCodeVerification = async (codeVerification, to) => {
    let isSend = false;
    try {
        let html = (fs.readFileSync(path.join(__dirname, "../../resources/html/codeRecuperation.html"), 'utf8'));
        html = html.replace("{code}", codeVerification);
        html = html.replace("{email}", to);
        let result = await mailer.sendMail({
            from: `${mailer.options.auth.user}`,
            to,
            subject: `UVGram Code Confirmation`,
            html,
        });
        isSend = (result.accepted.length !== 0);
    } catch (error) {
        throw new Error(error.message);
    }
    return isSend;
}

/**
 * Send change email URL confirmation to an specific email
 * @param {*} url the url that was generated.
 * @param {*} to email address who will receive the mail
 * @returns true if sent otherwise false
 */
const sendEmailChangeURLConfirmation = async (url, to) => {
    let isSend = false;
    try {
        let html = (fs.readFileSync(path.join(__dirname, "../../resources/html/changeConfirmationURL.html"), 'utf8'));
        html = html.replace("{url}", url);
        html = html.replace("{email}", to);
        let result = await mailer.sendMail({
            from: `${mailer.options.auth.user}`,
            to,
            subject: `UVGram URL Verification`,
            html,
        });
        isSend = (result.accepted.length !== 0);
    } catch (error) {
        throw new Error(error.message);
    }
    return isSend;
}

/**
 * Send password recover URL confirmation to an specific email
 * @param {*} url the url that was generated.
 * @param {*} to email address who will receive the mail
 * @returns true if sent otherwise false
 */
const sendEmailPasswordURLConfirmation = async (url, to) => {
    let isSend = false;
    try {
        let html = (fs.readFileSync(path.join(__dirname, "../../resources/html/updatePasswordURL.html"), 'utf8'));
        html = html.replace("{url}", url);
        html = html.replace("{email}", to);
        let result = await mailer.sendMail({
            from: `${mailer.options.auth.user}`,
            to,
            subject: `UVGram URL Verification`,
            html,
        });
        isSend = (result.accepted.length !== 0);
    } catch (error) {
        throw new Error(error.message);
    }
    return isSend;
}

/**
 * ONLY FOR TESTING PURPOSES: WARNING
 * This method is designed to be used with MailHog in 
 * TEST environments NOT IN PROD environment.
 * Get confirmation code sent to email
 * @param {*} to the client email who received the server email
 * @returns verificationCode from MailHog
 */
const getVerificationCodeFromEmail = async (to) => {
    let code;
    await axios.get(`http://${TEST_NODEMAILER_HOST}:${TEST_NODEMAILER_PORT_APIV2}/api/v2/search?kind=to&query=${encodeURIComponent(to)}&start=0&limit=1`).then(response => {
        if ((response.data.items).length != 0) {
            let html = (response.data.items[0].Raw.Data).toString();
            html = html.replaceAll("\n\r", "");
            html = html.replaceAll("\r\n", "");
            let indexOfSpan = html.search('<span id=3D"verificationcode"');
            html = html.substring(indexOfSpan);
            let indexOfFirstEndSpan = html.search(">");
            html = html.substring(indexOfFirstEndSpan + 1);
            let indexOfEndSpan = html.search("<");
            html = html.substring(0, indexOfEndSpan);
            code = html;
        }
    });
    return code;
}
/**
 * ONLY FOR TESTING PURPOSES: WARNING
 * This method is designed to be used with MailHog in 
 * TEST environments NOT IN PROD environment.
 * Get url sent to email
 * @param {*} to the client email who received the server email
 * @returns url from MailHog
 */
const getURLConfirmationFromEmail = async (to) => {
    let url;
    try {
        await axios.get(`http://${TEST_NODEMAILER_HOST}:${TEST_NODEMAILER_PORT_APIV2}/api/v2/search?kind=to&query=${encodeURIComponent(to)}&start=0&limit=1`).then(response => {
            if ((response.data.items).length != 0) {
                let html = (response.data.items[0].Raw.Data).toString();
                // html = html.replaceAll("\n\r", "");
                // html = html.replaceAll("\r\n", "");
                let indexOfHref = html.search('class=3D"btn" target=3D"_blank" href=3D"');
                html = html.substring(indexOfHref);
                let indexOfProtocol = html.search('http');
                html = html.substring(indexOfProtocol);
                let indexOfDoubleQuote = html.search('">');
                html = html.substring(0, indexOfDoubleQuote);
                html = html.replaceAll("=\r\n", "");
                html = html.replaceAll("=3D", "=");
                url = html;
            }
        })
    } catch (error) {
        throw new Error(error);
    }
    return url;
}

module.exports = { sendEmailCodeVerification, sendEmailChangeURLConfirmation, getVerificationCodeFromEmail, getURLConfirmationFromEmail, sendEmailPasswordURLConfirmation }

