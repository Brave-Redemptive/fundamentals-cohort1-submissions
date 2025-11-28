import db from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

export class TeamService {
  getAllMembers() {
    return db.users.sort((a, b) =>
      new Date(b.joinedAt) - new Date(a.joinedAt)
    );
  }

  getMemberById(id) {
    const member = db.users.find(m => m.id === parseInt(id));
    if (!member) {
      throw new AppError('Team member not found', 404);
    }
    return member;
  }

  getMemberByEmail(email) {
    const member = db.users.find(m => m.email.toLowerCase() === email.toLowerCase());
    if (!member) {
      throw new AppError('Team member not found', 404);
    }
    return member;
  }

  getMembersByRole(role) {
    return db.users.filter(m => m.role.toLowerCase() === role.toLowerCase());
  }
}

export default new TeamService();
