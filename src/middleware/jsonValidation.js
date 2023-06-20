const { httpResponseBadRequest } = require("../helpers/httpResponses");

const handleJSON = (error, request, response, next) => {
    if (error.type === 'entity.parse.failed') {
        return httpResponseBadRequest(response, { message: "You have sent an invalid JSON" });
    } else {
        next(error);
    }
};

module.exports = { handleJSON }