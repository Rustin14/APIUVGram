const { createCommentPost, getAllCommentsOfUUIDPost, likeComment, dislikeComment, getUsersWhoLikesComment, deleteComment, createAnswerToComment } = require('../controllers/commentController');
const { checkAccessTokenAndAuthRoleMiddleware } = require('../middleware/authentication');
const { UserRoleType } = require('../models/enum/UserRoleType');
const { validationDoesExistCommentUUID, validationIsCommentAlreadyLikedByUser, validationIsCommentAlreadyDislikedByUser, validationDeleteCommentIfOwner } = require('../validators/commentValidation');
const { formatValidationUUIDCommentData, formatValidationCommentData } = require('../validators/formatValidators/commentValidator');
const { validationDoesExistPostUUID } = require('../validators/postValidation');
const { validationDoesUserBlocked, validationDoesUserIsPrivateAndUnfollowedByActualUser } = require('../validators/userValidation');
const router = require('express').Router();

router.post("/post/comment/create/",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    formatValidationUUIDCommentData,
    formatValidationCommentData,
    validationDoesExistPostUUID,
    validationDoesUserIsPrivateAndUnfollowedByActualUser,
    createCommentPost
);

router.post("/post/comment/like/",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    formatValidationUUIDCommentData,
    validationDoesExistCommentUUID,
    validationDoesUserIsPrivateAndUnfollowedByActualUser,
    validationIsCommentAlreadyLikedByUser,
    likeComment
);

router.post("/post/comment/dislike/",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    formatValidationUUIDCommentData,
    validationDoesExistCommentUUID,
    validationDoesUserIsPrivateAndUnfollowedByActualUser,
    validationIsCommentAlreadyDislikedByUser,
    dislikeComment
);

router.get("/post/comment/details/likes/:uuid",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    formatValidationUUIDCommentData,
    validationDoesExistCommentUUID,
    validationDoesUserBlocked,
    validationDoesUserIsPrivateAndUnfollowedByActualUser,
    getUsersWhoLikesComment
);

router.delete("/post/comment/delete/",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    formatValidationUUIDCommentData,
    validationDoesExistCommentUUID,
    validationDoesUserIsPrivateAndUnfollowedByActualUser,
    validationDeleteCommentIfOwner,
    deleteComment
);

router.get("/post/comment/all/:uuid",
    checkAccessTokenAndAuthRoleMiddleware([UserRoleType.ADMINISTRATOR, UserRoleType.BUSINESS, UserRoleType.MODERATOR, UserRoleType.PERSONAL]),
    formatValidationUUIDCommentData,
    validationDoesExistPostUUID,
    validationDoesUserIsPrivateAndUnfollowedByActualUser,
    getAllCommentsOfUUIDPost
);

module.exports = router;