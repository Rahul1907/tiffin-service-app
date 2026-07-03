import express from 'express';
import {
  getReviews,
  createReview,
  deleteReview,
} from '../controllers/reviewController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getReviews)
  .post(createReview);

router.route('/:id')
  .delete(protect, adminOnly, deleteReview);

export default router;
