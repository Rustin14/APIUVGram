const { Router } = require("express");
const { checkRolesAuth } = require("../controllers/authenticationController");
const { validationAccesTokenDataAsAuthorization, validationRefreshTokenDataAsParameter, validationAccesTokenDataAsOptionalAuthorization } = require("../validators/authenticationValidation");
const { formatValidationAuthorizationToken, formatValidationRefreshTokenAsParameter, formatValidationOptionalAccessToken } = require("../validators/formatValidators/authenticationFormatValidator");

const checkAccessTokenAndAuthRoleMiddleware = (roles) => Router().use([
    formatValidationAuthorizationToken,
    validationAccesTokenDataAsAuthorization,
    checkRolesAuth(roles),
]);

const checkAccessAndRefreshTokenAndAuthRoleMiddleware = (roles) => Router().use([
    formatValidationAuthorizationToken,
    formatValidationRefreshTokenAsParameter,
    validationAccesTokenDataAsAuthorization,
    validationRefreshTokenDataAsParameter,
    checkRolesAuth(roles),
]);

const checkAccessTokenAsOptionalMiddleware = () => Router().use([
    formatValidationOptionalAccessToken,
    validationAccesTokenDataAsOptionalAuthorization
]);

module.exports = { checkAccessTokenAndAuthRoleMiddleware, checkAccessAndRefreshTokenAndAuthRoleMiddleware, checkAccessTokenAsOptionalMiddleware }