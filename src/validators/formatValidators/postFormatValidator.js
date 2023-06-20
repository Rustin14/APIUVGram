const { httpResponseValidation } = require('../../helpers/httpResponses');
const { validateFileData, validatePostDescriptionData, validatePostCommentsAllowed, validatePostLikesAllowed, validatePostUUID } = require('./formatValidator');

const formatValidationPostData = [
    validateFileData,
    validatePostDescriptionData,
    validatePostCommentsAllowed,
    validatePostLikesAllowed,
    (request, response, next) => {
        return httpResponseValidation(request, response, next);
    }
];

const formatValidationFileData = [
    validateFileData,
    (request, response, next) => {
        return httpResponseValidation(request, response, next);
    }
]

const formatValidationUUIDPostData = [
    validatePostUUID,
    (request, response, next) => {
        return httpResponseValidation(request, response, next);
    }
];

module.exports = {
    formatValidationPostData, formatValidationUUIDPostData, formatValidationFileData
}
