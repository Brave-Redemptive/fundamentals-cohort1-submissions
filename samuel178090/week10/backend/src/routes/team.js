import express from 'express';
import {
  getAllMembers,
  getMemberById,
  getMembersByRole
} from '../controllers/teamController.js';

const router = express.Router();

// GET all team members or filter by role
router.get('/', (req, res, next) => {
  if (req.query.role) {
    return getMembersByRole(req, res, next);
  }
  return getAllMembers(req, res, next);
});

// GET team member by ID
router.get('/:id', getMemberById);

export default router;
