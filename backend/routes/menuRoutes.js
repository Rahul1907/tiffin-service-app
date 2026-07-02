import express from 'express';
import {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../controllers/menuController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getMenuItems)
  .post(protect, adminOnly, createMenuItem);

router.route('/:id')
  .get(getMenuItemById)
  .put(protect, adminOnly, updateMenuItem)
  .delete(protect, adminOnly, deleteMenuItem);

export default router;
