const express = require('express');
const reviewController = require('../controllers/reviewController');
const router = express.Router({
  mergeParams: true,
});
const authController = require('../controllers/authController');

router.use(authController.protect);
router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview,
  );
  
router
  .route('/:id')
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview,
  )
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview,
  );
module.exports = router;
