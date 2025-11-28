import teamService from '../services/teamService.js';
import { sendSuccess } from '../utils/response.js';
import logger from '../config/logger.js';

export const getAllMembers = (_req, res, next) => {
  try {
    logger.info('Fetching all team members');
    const members = teamService.getAllMembers();
    sendSuccess(res, members, 'Team members retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getMemberById = (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info(`Fetching team member with ID: ${id}`);
    const member = teamService.getMemberById(id);
    sendSuccess(res, member, 'Team member retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getMembersByRole = (req, res, next) => {
  try {
    const { role } = req.query;
    logger.info(`Fetching team members with role: ${role}`);
    const members = teamService.getMembersByRole(role);
    sendSuccess(res, members, `Team members with role "${role}" retrieved successfully`);
  } catch (error) {
    next(error);
  }
};
