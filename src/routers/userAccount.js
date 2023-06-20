const router = require('express').Router();
const { addUser, removeUserByUsername, createVerificationCode, getAllUsers, changePasswordOnLoggedUser, updateUser, createURLVerification, changeUserRoleByEmailOrUsername, changePrivacyType, getUserAccountData } = require('../controllers/userAccountController');
const { checkAccessTokenAndAuthRoleMiddleware } = require('../middleware/authentication');
const { UserRoleType } = require('../models/enum/UserRoleType');
const { formatValidationEmailOrUsername } = require('../validators/formatValidators/authenticationFormatValidator');
const { formatValidationUserAccountData, formatValidationAccountEmail, formatValidationAccountUsername, formatValidationVerificationCode, formatValidationPassword, formatValidationOldPassword, formatValidationBasicUserAccountData, formatValidationPersonalData, formatValidationBusinessData, formatValidationAdminData, formatValidationModerator, formatValidationNewRoleType, formatValidationPrivacyData } = require('../validators/formatValidators/userAccountFormatValidator');
const { validationIsURLRecoverAlreadyGeneratedByEmailOrUsername } = require('../validators/urlRecoverValidation');
const { validationIsUsernameRegisteredWithNext, validationisEmailRegisteredWithNext, validationIsEmailRegistered, validationIsUsernameRegistered, validationNotGeneratedVerificationCode, validationVerificationCodeMatches, validationChangePasswordLoggedUser, validationEmailOrUsernameRejectOnNotExist, validationUpdateEmailAndUsernameData, validationPersonalRoleData, validationModeratorRoleData, validationAdminRoleData, validationBusinessRoleData, validationSecretKey, validationUserPrivacy } = require('../validators/userAccountValidation');

router.post("/accounts/create",
    formatValidationUserAccountData,
    formatValidationVerificationCode,
    validationIsUsernameRegisteredWithNext,
    validationisEmailRegisteredWithNext,
    validationVerificationCodeMatches,
    addUser
);

router.post("/accounts/create/verification",
    formatValidationAccountUsername,
    formatValidationAccountEmail,
    validationNotGeneratedVerificationCode,
    createVerificationCode
);

router.post("/accounts/password/reset",
    formatValidationEmailOrUsername,
    validationEmailOrUsernameRejectOnNotExist,
    validationIsURLRecoverAlreadyGeneratedByEmailOrUsername,
    createURLVerification
);

router.post("/accounts/password/change",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    formatValidationPassword,
    formatValidationOldPassword,
    validationChangePasswordLoggedUser,
    changePasswordOnLoggedUser
);

router.get("/accounts/username/check/:username",
    formatValidationAccountUsername,
    validationIsUsernameRegistered
);

router.get("/accounts/email/check/:email",
    formatValidationAccountEmail,
    validationIsEmailRegistered
);

router.delete("/accounts/username/delete",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR]),
    formatValidationAccountUsername,
    removeUserByUsername
);

router.patch("/accounts/edit/personal",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.PERSONAL]),
    formatValidationBasicUserAccountData,
    formatValidationPersonalData,
    validationUpdateEmailAndUsernameData,
    validationPersonalRoleData,
    updateUser
);

router.get("/accounts/users/",
    checkAccessTokenAndAuthRoleMiddleware(UserRoleType.ADMINISTRATOR),
    getAllUsers
);

router.post("/accounts/users/change-privacy",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    formatValidationPrivacyData,
    validationUserPrivacy,
    changePrivacyType
);

router.get("/accounts/data",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    getUserAccountData
);

module.exports = router;