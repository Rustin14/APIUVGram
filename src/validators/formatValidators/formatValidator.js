const { check, body, header } = require('express-validator');
const { CategoryType } = require('../../models/enum/CategoryType');
const { GenderType } = require('../../models/enum/GenderType');
const { UserRoleType } = require('../../models/enum/UserRoleType');
const { PrivacyType } = require('../../models/enum/PrivacyType');

const filesWhiteList = {
    'image/png': "10490000",
    'image/jpeg': "10490000",
    'image/jpg': "10490000",
    'image/webp': "10490000",
    'video/mp4': "1600000000",
    'video/quicktime': "1600000000"
}

const validateFileData = [
    check("file")
        .custom((value, { req }) => {
            let files = [].concat(req.files["file[]"]);
            files.forEach(file => {
                if (filesWhiteList[file.mimetype] == null) {
                    throw new Error(`${file.name} must be allowed type: ${Object.keys(filesWhiteList).join(" ").replaceAll(/(image\/|video\/)/g, '.')}`)
                }
                return true;
            });
            return true
        })
        .withMessage(`file must be allowed type: ${Object.keys(filesWhiteList).join(" ").replaceAll(/(image\/|video\/)/g, '.')}`)
        .bail()
        .custom((value, { req }) => {
            let files = [].concat(req.files["file[]"]);
            files.forEach(file => {
                if (file.size > filesWhiteList[file.mimetype]) {
                    throw new Error(`size of file ${file.name} can not be more than ${filesWhiteList[file.mimetype]} bytes`);
                }
                return true;
            })
            return true;
        })
        .bail()
];

const validateEmailData = [
    check("email")
        .trim()
        .not()
        .isEmpty()
        .withMessage("email is required")
        .bail()
        .isLength({ min: 3, max: 254 })
        .withMessage("email allowed length: {min: 3, max: 254}")
        .bail()
        .isEmail()
        .normalizeEmail()
        .withMessage("email format is not valid. must have allowed format: hello@example.com")
];

const validateEmailAsOptional = [
    check("email")
        .optional({ nullable: false })
        .not()
        .isEmpty()
        .withMessage("email is optional, but is not allowed to be empty")
        .bail()
        .isLength({ min: 3, max: 254 })
        .withMessage("email allowed length: {min: 3, max: 254}")
        .bail()
        .isEmail()
        .normalizeEmail()
        .withMessage("email format is not valid. must have allowed format: hello@example.com")
];

const validateUsernameData = [
    check("username")
        .not()
        .isEmpty()
        .withMessage("username is required")
        .bail()
        .isLength({ min: 3, max: 30 })
        .withMessage("username must have the allowed length: {min: 3, max: 30}")
        .matches(/^[\w]+(\.([\w]+))*$/)
        .withMessage("username is not valid, must have allowed characters: words, numbers. no allowed spaces and period as last character")
        .isLowercase()
        .withMessage("username is not valid, must have allowed characters: only lowercase allowed")
];

const validateNameData = [
    check("name")
        .optional({ nullable: true })
        .bail()
        .isLength({ min: 3, max: 64 })
        .withMessage("name must have the allowed length: {min: 3, max: 64}")
        .bail()
        .matches(/^[a-zA-Zñ]+(\ ([a-zA-Zñ]+))*$/)
        .withMessage("name is not valid, must have allowed characters: a-zA-Z and one space between words")
];

const validatePresentationData = [
    check("presentation")
        .optional({ nullable: true })
        .bail()
        .isLength({ min: 0, max: 150 })
        .withMessage("presentation must have the allowed length: {min: 0, max: 150}")
];

const validatePasswordData = [
    check("password")
        .not()
        .isEmpty()
        .withMessage("password is required")
        .bail()
        .isLength({ min: 6, max: 128 })
        .withMessage("password must have the allowed length: {min: 6, max: 128}")
];

const validatePhoneNumberData = [
    check("phoneNumber")
        .isLength({ min: 8, max: 15 })
        .withMessage("phoneNumber must have the allowed length: {min: 8, max: 15}")
        .matches(/^[\d]*$/)
        .withMessage("phoneNumber must have the allowed characters: digits")
];

const validateBirthdateData = [
    check("birthdate")
        .isISO8601('yyyy-mm-dd')
        .withMessage("birthday format is invalid, must have the allowed format: yyyy-mm-dd")
        .bail()
        .custom((value, { req }) => {
            return isValidDate(value);
        })
        .withMessage("birthday does not exist")
];

const validateUserPrivacyData = [
    check("privacy")
        .not()
        .isEmpty()
        .withMessage("privacy is required")
        .bail()
        .toUpperCase()
        .custom((value, { req }) => {
            return valueExistInEnumType(value, PrivacyType)
        })
        .withMessage(`privacy must be ${Object.values(PrivacyType)}`)
];

const validateEmailOrUsernameData = [
    check("emailOrUsername")
        .not()
        .isEmpty()
        .withMessage("emailOrUsername is required")
        .bail()
        .isLength({ min: 3, max: 254 })
        .withMessage("emailOrUsername must have the allowed length: {min: 3, max: 254}")
];

const validateOldPasswordData = [
    check("oldPassword")
        .not()
        .isEmpty()
        .withMessage("oldPassword is required")
        .bail()
        .isLength({ min: 6, max: 128 })
        .withMessage("oldpassword must have the allowed length: {min: 6, max: 128}")
];

const validateVerificationCodeData = [
    body("verificationCode")
        .not()
        .isEmpty()
        .withMessage("verificationCode is required")
        .bail()
        .isLength({ min: 8, max: 8 })
        .withMessage("verificationCode must have the allowed length: {min: 8, max:8}")
];

const validateAuthorizationHeaderData = [
    header("authorization")
        .not()
        .isEmpty()
        .withMessage("authorization header is required")
        .bail()
        .matches(/^Bearer\s{1}([^ ]+)$/)
        .withMessage("Bearer token is not valid, you must provide a valid token format")
];

const validateAccessTokenParameterData = [
    header("accessToken")
        .not()
        .isEmpty()
        .withMessage("accessToken header is required")
        .bail()
        .matches(/^Bearer\s{1}([^ ]+)$/)
        .withMessage("Bearer token is not valid, you must provide a valid token format")
];

const validateRefreshTokenParameterData = [
    header("refreshToken")
        .not()
        .isEmpty()
        .withMessage("refreshToken header is required")
        .bail()
        .matches(/^Bearer\s{1}([^ ]+)$/)
        .withMessage("Bearer token is not valid, you must provide a valid token format")
];

const validateOptionalAccessTokenParameterData = [
    header("accessToken")
        .optional({ nullable: true })
        .not()
        .isEmpty()
        .withMessage("accessToken header is optional, but is not allowed to be empty")
        .bail()
        .matches(/^Bearer\s{1}([^ ]+)$/)
        .withMessage("Bearer token is not valid, you must provide a valid token format")
];

const validateGenderData = [
    check("gender")
        .not()
        .isEmpty()
        .withMessage("gender is required")
        .bail()
        .custom((value, { req }) => {
            return valueExistInEnumType(value, GenderType)
        })
        .withMessage(`gender must be one this: ${Object.values(GenderType)}`)
        .bail()
        .matches(/^[A-Z]+(\_([A-Z]+))*$/)
        .withMessage("gender must have the allowed characters: upper letters and separated by underscore if more than 2 words")
];

const validateIdCareer = [
    check("idCareer")
        .not()
        .isEmpty()
        .withMessage("idCareer is required")
        .bail()
        .matches(/^[\d]*$/)
        .withMessage("phoneNumber must have the allowed characters: digits")
];

const validateCategory = [
    check("category")
        .not()
        .isEmpty()
        .withMessage("category is required")
        .bail()
        .custom((value, { req }) => {
            return valueExistInEnumType(value, CategoryType)
        })
        .withMessage(`category must be one this: ${Object.values(CategoryType)}`)
        .bail()
        .matches(/^[A-Z]+(\_([A-Z]+))*$/)
        .withMessage("category must have the allowed characters: upper letters and separated by underscore if more than 2 words")
];

const validateCity = [
    check("city")
        .not()
        .isEmpty()
        .withMessage("city is required")
        .bail()
        .isLength({ min: 3, max: 30 })
        .withMessage("city must have the allowed length: {min: 3, max: 340}")
        .bail()
        .matches(/^[a-zA-Z]+(\ ([a-zA-Z]+))*$/)
        .withMessage("city is not valid, must have allowed characters: words, numbers. no allowed spaces and period as last character")
];

const validatePostalCode = [
    check("postalCode")
        .not()
        .isEmpty()
        .withMessage("postalCode is required")
        .bail()
        .isLength({ min: 4, max: 16 })
        .withMessage("postalCode must have the allowed length: {min: 4, max: 16}")
        .bail()
        .matches(/^[\w]+([-_]([\w]+))*$/)
        .withMessage("postalCode is not valid, must have allowed characters: no spaces")
];

const validatePostalAddress = [
    check("postalAddress")
        .not()
        .isEmpty()
        .withMessage("postalAddress is required")
        .bail()
        .isLength({ min: 4, max: 420 })
        .withMessage("postalAddress must have the allowed length: {min: 4, max: 420}")
        .bail()
        .matches(/^[\w]+(\ ([\w]+))*$/)
        .withMessage("postalAddress is not valid, mut have allowed characters: words, numbers and no spaces between words")
]

const validateContactEmail = [
    check("contactEmail")
        .not()
        .isEmpty()
        .withMessage("contactEmail is required")
        .bail()
        .isLength({ min: 3, max: 340 })
        .withMessage("contactEmail allowed length: {min: 3, max: 340}")
        .bail()
        .isEmail()
        .normalizeEmail()
        .withMessage("contactEmail format is not valid. must have allowed format: hello@example.com")
];

const validatePhoneContact = [
    check("phoneContact")
        .isLength({ min: 8, max: 15 })
        .withMessage("phoneContact must have the allowed length: {min: 8, max: 15}")
        .bail()
        .matches(/^[\d]*$/)
        .withMessage("phoneContact must have the allowed characters: digits")
];

const validateOrganizationName = [
    check("organizationName")
        .not()
        .isEmpty()
        .withMessage("organizationName is required")
        .bail()
        .isLength({ min: 3, max: 340 })
        .withMessage("name must have the allowed length: {min: 3, max: 340}")
        .bail()
        .matches(/^[a-zA-Z0-9ñ]+(\ ([a-zA-Z0-9ñ]+))*$/)
        .withMessage("name is not valid, must have allowed characters: a-zA-Z0-9 and one space between words")
];

const validateUUIDTemporalToken = [
    check("temporalToken")
        .not()
        .isEmpty()
        .withMessage("temporalToken is required")
        .bail()
];

const validateNewRoleTypeData = [
    check("newRoleType")
        .not()
        .isEmpty()
        .withMessage("newRoleType is required")
        .bail()
        .toUpperCase()
        .custom((value, { req }) => {
            return valueExistInEnumType(value, UserRoleType)
        })
        .withMessage(`newRoleType must be one this: ${Object.values(UserRoleType)}`)
];

const validatePostDescriptionData = [
    check("description")
        .optional({ nullable: true })
        .bail()
        .isLength({ min: 0, max: 2200 })
        .withMessage("description must have the allowed length: {min: 0, max: 2200}")
];

const validatePostCommentsAllowed = [
    check("commentsAllowed")
        .not()
        .isEmpty()
        .withMessage("commentsAllowed is required")
        .bail()
        .toUpperCase()
        .not()
        .isBoolean()
        .withMessage("commentsAllowed must be boolean value")
];

const validatePostLikesAllowed = [
    check("likesAllowed")
        .not()
        .isEmpty()
        .withMessage("likesAllowed is required")
        .bail()
        .toUpperCase()
        .not()
        .isBoolean()
        .withMessage("likesAllowed must be boolean value")
];

const validatePostUUID = [
    check("uuid")
        .not()
        .isEmpty()
        .withMessage("uuid of post is required")
        .bail()
        .isLength({ min: 8, max: 16 })
        .withMessage("uuid of post must have the allowed length: {min: 8, max: 16}")
];

const validateCommentUUID = [
    check("uuid")
        .not()
        .isEmpty()
        .withMessage("uuid of comment is required")
        .bail()
        .isLength({ min: 8, max: 16 })
        .withMessage("uuid of comment must have the allowed length: {min: 8, max: 16}")
];

const validateCommentData = [
    check("comment")
        .not()
        .isEmpty()
        .withMessage("comment is required")
        .bail()
        .isLength({ min: 1, max: 2200 })
        .withMessage("comment must have the allowed length: {min: 1, max: 2200}")
];

const valueExistInEnumType = (value, enumType) => {
    if (Object.values(enumType).includes(value)) {
        return true;
    }
    return false;
};

const isValidDate = (dateString) => {
    // Parse the date parts to integers
    let parts = dateString.split("-");
    let day = parseInt(parts[2], 10);
    let month = parseInt(parts[1], 10);
    let year = parseInt(parts[0], 10);
    // Check the ranges of month and year
    if (year < 1000 || year > 3000 || month === 0 || month > 12)
        return false;
    let monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    // Adjust for leap years
    if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0))
        monthLength[1] = 29;
    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
};

module.exports = {
    validateEmailData, validateUsernameData, validateNameData,
    validatePresentationData, validatePasswordData, validatePhoneNumberData,
    validateBirthdateData, validateEmailOrUsernameData, validateVerificationCodeData,
    validateAuthorizationHeaderData, validateAccessTokenParameterData, validateRefreshTokenParameterData,
    validateOptionalAccessTokenParameterData, validateOldPasswordData, validateEmailAsOptional,
    validateIdCareer, validateGenderData, validateCategory, validateCity, validatePostalCode,
    validatePostalAddress, validateContactEmail, validatePhoneContact, validateOrganizationName,
    validateUUIDTemporalToken, validateNewRoleTypeData, validateFileData,
    validatePostDescriptionData, validatePostCommentsAllowed, validatePostLikesAllowed,
    validatePostUUID, validateCommentUUID, validateCommentData, validateUserPrivacyData
}