const { getDataURLRecover, doesURLVerificationAlreadyGenerated } = require("../dataaccess/urlRecoverDataAccess");
const { getAccountLoginData } = require("../dataaccess/userDataAccess");
const { httpResponseNotFound, httpResponseForbidden, httpResponseInternalServerError } = require("../helpers/httpResponses");

const validationURLRecover = async (request, response, next) => {
    let uri = request.query;
    let result;
    try {
        result = await getDataURLRecover(uri);
        response.locals.data = result;
    } catch (error) {
        return httpResponseNotFound(response, "URL is not valid");
    }
    if (!result) {
        return httpResponseNotFound(response, "URL has expired");
    }
    return next();
};

const validationIsURLRecoverAlreadyGeneratedByEmailOrUsername = async (request, response, next) => {
    let { emailOrUsername } = request.body;
    try {
        let userData = await getAccountLoginData(emailOrUsername);
        let isAlreadyURLGenerated = await doesURLVerificationAlreadyGenerated(userData.id);
        if (isAlreadyURLGenerated) {
            return httpResponseForbidden(response, "please wait 5 minutes to generate another one");
        }
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return next();
}


module.exports = { validationURLRecover, validationIsURLRecoverAlreadyGeneratedByEmailOrUsername }