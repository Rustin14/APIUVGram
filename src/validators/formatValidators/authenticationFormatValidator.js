const { httpResponseValidation } = require('../../helpers/httpResponses');
const { validatePasswordData, validateEmailOrUsernameData, validateAuthorizationHeaderData,
    validateRefreshTokenParameterData, validateAccessTokenParameterData, validateOptionalAccessTokenParameterData } = require('./formatValidator');

const formatValidationLogin = [
    validateEmailOrUsernameData,
    validatePasswordData,
    (request, response, next) => {
        return httpResponseValidation(request, response, next);
    }
];

const formatValidationEmailOrUsername = [
    validateEmailOrUsernameData,
    (request, response, next) => {
        return httpResponseValidation(request, response, next);
    }
];

const formatValidationAccessTokenAsParameter = [
    validateAccessTokenParameterData,
    (request, response, next) => {
        return httpResponseValidation(request, response, next);
    }
];

const formatValidationRefreshTokenAsParameter = [
    validateRefreshTokenParameterData,
    (request, response, next) => {
        return httpResponseValidation(request, response, next);
    }
];

const formatValidationRefreshAndAccessToken = [
    validateAuthorizationHeaderData,
    validateRefreshTokenParameterData,
    (request, response, next) => {
        return httpResponseValidation(request, response, next);
    }
];

const formatValidationAuthorizationToken = [
    validateAuthorizationHeaderData,
    (request, response, next) => {
        return httpResponseValidation(request, response, next);
    }
];

const formatValidationOptionalAccessToken = [
    validateOptionalAccessTokenParameterData,
    (request, response, next) => {
        return httpResponseValidation(request, response, next);
    }
];

module.exports = {
    formatValidationRefreshAndAccessToken, formatValidationAccessTokenAsParameter, formatValidationRefreshTokenAsParameter,
    formatValidationLogin, formatValidationAuthorizationToken, formatValidationOptionalAccessToken, formatValidationEmailOrUsername,
}

