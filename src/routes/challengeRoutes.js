const express = require('express');
const router = express.Router();

const controller = require('../controllers/challengeController');
const userController = require('../controllers/userController');

router.post('/', controller.createNewChallenge);
router.get('/', controller.readAllChallenge);
router.get('/review', controller.readAllReview);
router.put('/:id', controller.updateChallengeById);
router.delete('/:id', controller.deleteChallengeById);

router.post('/:id', controller.createCompleteRecord, userController.addChallengeSkillpoints);
router.get('/:id', controller.readChallengeById);

router.get('/review/:id', controller.readReviewByID);
router.get('/:id/review', controller.readAllReviewByChallengeID);
router.post('/:id/review', controller.createReviewByChallengeID);
router.delete('/:id/review/:review_id', controller.deleteReviewByChallengeReviewId);
router.put('/:id/review/:review_id', controller.editReviewByChallengeReviewId);

router.delete('/review/:id', controller.deleteReviewById);
router.put('/review/:id', controller.editReviewById);

module.exports = router;