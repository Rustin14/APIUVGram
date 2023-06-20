const router = require('express').Router();
const { getFiles } = require('../dataaccess/fileServerDataAccess');
const { getURLResourceData } = require('../dataaccess/urlRecoverDataAccess');
const { httpResponseForbidden } = require('../helpers/httpResponses');

router.get("/resources/post-files?:data",
    async function (request, response) {
        let url = request.query;
        try {
            await getURLResourceData(url).then(result => {
                if(result) {
                    getFiles(result.idUser, result.idPost, result.filename, response, result.contentType);
                }
            })
        } catch (error) {
            return httpResponseForbidden(response, "URL does not exist");
        }
    }
);

module.exports = router;