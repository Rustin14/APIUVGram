const { getAllFacultyAvailables: getAllFacultyAvailablesDataAccess, getAllEducationalProgram: getAllEducationalProgramDataAccess, getAllRegion: getAllRegionDataAccess, addRegion, addFacultyToRegion, addEducationalProgramToFaculty } = require("../dataaccess/educationalProgramDataAccess");
const { httpResponseInternalServerError, httpResponseOk } = require("../helpers/httpResponses");

const getAllEducationalProgram = async (request, response) => {
    let data = [];
    try {
        data = await getAllEducationalProgramDataAccess();
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, data);
};

const getAllFacultyAvailables = async (request, response) => {
    let data = [];
    try {
        data = await getAllFacultyAvailablesDataAccess();
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, data);
};

const getAllRegion = async (request, response) => {
    let data = [];
    try {
        data = await getAllRegionDataAccess();
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, data);
};

const addNewRegion = async (request, response) => {
    let isRegistered = false;
    let { region } = request.body;
    try {
        isRegistered = await addRegion(region);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, { isRegistered });
}

const addNewFacultyToRegion = async (request, response) => {
    let isRegistered = false;
    let { idRegion, faculty } = request.body;
    try {
        isRegistered = await addFacultyToRegion(faculty, idRegion);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, { isRegistered });
}

const addNewEducationalProgramToFaculty = async (request, response) => {
    let isRegistered = false;
    let { idFaculty, educationalProgram } = request.body;
    try {
        isRegistered = await addEducationalProgramToFaculty(educationalProgram, idFaculty);
    } catch (error) {
        return httpResponseInternalServerError(response, error);
    }
    return httpResponseOk(response, { isRegistered });
}

module.exports = { getAllEducationalProgram, getAllFacultyAvailables, getAllRegion, addNewRegion, addNewFacultyToRegion, addNewEducationalProgramToFaculty }