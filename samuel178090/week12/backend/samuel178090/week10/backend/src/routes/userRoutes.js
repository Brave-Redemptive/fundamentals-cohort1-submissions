import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/userController.js';
import { validateCreateUser } from '../middleware/validator.js';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', validateCreateUser, createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
