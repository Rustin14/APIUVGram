const { httpResponseValidation } = require("../../helpers/httpResponses");
const { validateCommentUUID, validateCommentData } = require("./formatValidator");

const formatValidationUUIDCommentData = [
    validateCommentUUID,
    (request, response, next) => {
        return httpResponseValidation(request, response, next);
    }
];


const formatValidationCommentData = [
    validateCommentData,
    (request, response, next) => {
        return httpResponseValidation(request, response, next);
    }
];

module.exports = {
    formatValidationUUIDCommentData, formatValidationCommentData
}