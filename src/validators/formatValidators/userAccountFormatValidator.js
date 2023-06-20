const { httpResponseValidation } = require('../../helpers/httpResponses');
const { validateNameData, validatePresentationData, validateUsernameData, validatePasswordData,
    validatePhoneNumberData, validateEmailData, validateBirthdateData, validateVerificationCodeData, validateOldPasswordData, validateEmailAsOptional, validateIdCareer, validateGenderData, validateCategory, validateCity, validatePostalCode, validatePostalAddress, validateContactEmail, validatePhoneContact, validateOrganizationName, validateNewRoleTypeData, validateUserPrivacyData } = require('./formatValidator');

const formatValidationUserAccountData = [
    validateNameData,
    validatePresentationData,
    validateUsernameData,
    validatePasswordData,
    validatePhoneNumberData,
    validateEmailData,
    validateBirthdateData,
    (request, response, next) => {
        return httpResponseValidation(request, response, next);
    }
];

const formatValidationBasicUserAccountData = [
    validateNameData,
    validatePresentationData,
    validateUsernameData,
    validatePhoneNumberData,
    validateEmailAsOptional,
    validateBirthdateData,
    (request, response, next) => {
        return httpResponseValidation(request, response, next);
    }
];

const formatValidationPersonalData = [
    validateIdCareer,
    validateGenderData,
    (request, response, next) => {
        return httpResponseValidation(request, response, next);
    }
];

const formatValidationBusinessData = [
    validateCategory,
    validateCity,
    validatePostalCode,
    validatePostalAddress,
    validateContactEmail,
    validatePhoneContact,
    validateOrganizationName,
    (request, response, next) => {
        return httpResponseValidation(request, response, next);
    }
];

const formatValidationAdminData = [
    (request, response, next) => {
        return httpResponseValidation(request, response, next);
    }
];

const formatValidationModerator = [
    (request, response, next) => {
        return httpResponseValidation(request, response, next);
    }
];

const formatValidationAccountEmail = [
    validateEmailData,
    (request, response, next) => {
        return httpResponseValidation(request, response, next);
    }
];

const formatValidationAccountUsername = [
    validateUsernameData,
    (request, response, next) => {
        return httpResponseValidation(request, response, next);
    }
];

const formatValidationVerificationCode = [
    validateVerificationCodeData,
    (request, response, next) => {
        return httpResponseValidation(request, response, next);
    }
];

const formatValidationOldPassword = [
    validateOldPasswordData,
    (request, response, next) => {
        return httpResponseValidation(request, response, next);
    }
];

const formatValidationPassword = [
    validatePasswordData,
    (request, response, next) => {
        return httpResponseValidation(request, response, next);
    }
];

const formatValidationNewRoleType = [
    validateNewRoleTypeData,
    (request, response, next) => {
        return httpResponseValidation(request, response, next);
    }
];

const formatValidationPrivacyData = [
    validateUserPrivacyData,
    (request, response, next) => {
        return httpResponseValidation(request, response, next);
    }
];

module.exports = {
    formatValidationUserAccountData, formatValidationAccountEmail, formatValidationAccountUsername,
    formatValidationVerificationCode, formatValidationOldPassword, formatValidationPassword,
    formatValidationBasicUserAccountData, formatValidationPersonalData, formatValidationBusinessData,
    formatValidationAdminData, formatValidationModerator, formatValidationNewRoleType, formatValidationPrivacyData
}

