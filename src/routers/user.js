const { followUser, unfollowUser, getFollowersOfUser,
    getProfileOfUser, getFollowedByUser, findByFilter } = require('../controllers/userController');
const { checkAccessTokenAndAuthRoleMiddleware, checkAccessTokenAsOptionalMiddleware } = require('../middleware/authentication');
const { UserRoleType } = require('../models/enum/UserRoleType');
const { formatValidationAccountUsername } = require('../validators/formatValidators/userAccountFormatValidator');
const { validationFollowingUser, validationUnfollowingUser, validationRejectOnUsernameNotRegistered, validationDoesUserIsPrivateAndUnfollowedByActualUser } = require('../validators/userValidation');
const router = require('express').Router();

router.post("/user/follow/",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    formatValidationAccountUsername,
    validationRejectOnUsernameNotRegistered,
    validationFollowingUser,
    followUser,
);

router.post("/user/unfollow/",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    formatValidationAccountUsername,
    validationRejectOnUsernameNotRegistered,
    validationUnfollowingUser,
    unfollowUser
);

router.get("/user/followed-by/:username/",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    formatValidationAccountUsername,
    validationRejectOnUsernameNotRegistered,
    validationDoesUserIsPrivateAndUnfollowedByActualUser,
    getFollowedByUser
);

router.get("/user/followers-of/:username",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    formatValidationAccountUsername,
    validationRejectOnUsernameNotRegistered,
    validationDoesUserIsPrivateAndUnfollowedByActualUser,
    getFollowersOfUser
);

// Need to get profile image
router.get("/:username/",
    checkAccessTokenAsOptionalMiddleware(),
    formatValidationAccountUsername,
    getProfileOfUser
);

router.get("/users/:filter",
    findByFilter,
);

module.exports = router;