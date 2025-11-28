// Mock database for in-memory storage
// In production, this would be replaced with MongoDB, PostgreSQL, etc.

export const database = {
  users: [
    {
      id: 1,
      name: 'Alice Chen',
      email: 'alice.chen@syncforge.com',
      password: 'hashed_password_123', // In production, use bcrypt
      role: 'Senior Engineer',
      timezone: 'EST',
      joinedAt: '2025-01-15',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice'
    },
    {
      id: 2,
      name: 'Bob Smith',
      email: 'bob.smith@syncforge.com',
      password: 'hashed_password_456',
      role: 'DevOps Engineer',
      timezone: 'PST',
      joinedAt: '2025-02-01',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob'
    },
    {
      id: 3,
      name: 'Priya Patel',
      email: 'priya.patel@syncforge.com',
      password: 'hashed_password_789',
      role: 'Frontend Engineer',
      timezone: 'IST',
      joinedAt: '2025-03-10',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya'
    }
  ],
  tasks: [
    {
      id: 1,
      title: 'Design API Architecture',
      description: 'Create comprehensive API design for task management system',
      status: 'in-progress',
      assignee: 'Alice Chen',
      priority: 'high',
      dueDate: '2025-12-05',
      createdAt: '2025-11-27',
      updatedAt: '2025-11-27'
    },
    {
      id: 2,
      title: 'Setup CI/CD Pipeline',
      description: 'Configure GitHub Actions for automated testing and deployment',
      status: 'completed',
      assignee: 'Bob Smith',
      priority: 'high',
      dueDate: '2025-11-30',
      createdAt: '2025-11-25',
      updatedAt: '2025-11-27'
    },
    {
      id: 3,
      title: 'Build React Components',
      description: 'Create reusable React components for the frontend',
      status: 'todo',
      assignee: 'Priya Patel',
      priority: 'medium',
      dueDate: '2025-12-08',
      createdAt: '2025-11-26',
      updatedAt: '2025-11-27'
    }
  ]
};

// Helper function to get next ID
export const getNextUserId = () => {
  return Math.max(...database.users.map(u => u.id), 0) + 1;
};

export const getNextTaskId = () => {
  return Math.max(...database.tasks.map(t => t.id), 0) + 1;
};

export default database;
