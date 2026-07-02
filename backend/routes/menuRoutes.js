import express from 'express';
import {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../controllers/menuController.js';

const router = express.Router();

router.route('/')
  .get(getMenuItems)
  .post(createMenuItem); // Admin check will be added in Phase 3

router.route('/:id')
  .get(getMenuItemById)
  .put(updateMenuItem) // Admin check will be added in Phase 3
  .delete(deleteMenuItem); // Admin check will be added in Phase 3

export default router;
