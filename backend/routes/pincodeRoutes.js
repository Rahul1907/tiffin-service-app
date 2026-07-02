import express from 'express';
import {
  getPincodes,
  createPincode,
  deletePincode,
} from '../controllers/pincodeController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getPincodes)
  .post(protect, adminOnly, createPincode);

router.route('/:id')
  .delete(protect, adminOnly, deletePincode);

export default router;
