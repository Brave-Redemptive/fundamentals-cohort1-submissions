import database, { getNextUserId } from '../config/database.js';

// Get all users
export const getAllUsers = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: database.users,
      count: database.users.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get user by ID
export const getUserById = (req, res) => {
  try {
    const user = database.users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create new user
export const createUser = (req, res) => {
  try {
    const { name, email, role = 'Team Member', timezone = 'UTC' } = req.body;

    // Check if user already exists
    const existingUser = database.users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    const newUser = {
      id: getNextUserId(),
      name,
      email,
      password: 'hashed_password', // In production: hash password
      role,
      timezone,
      joinedAt: new Date().toISOString().split('T')[0],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
    };

    database.users.push(newUser);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update user
export const updateUser = (req, res) => {
  try {
    const user = database.users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { name, role, timezone } = req.body;
    if (name) user.name = name;
    if (role) user.role = role;
    if (timezone) user.timezone = timezone;

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete user
export const deleteUser = (req, res) => {
  try {
    const index = database.users.findIndex(u => u.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const deletedUser = database.users.splice(index, 1);
    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: deletedUser[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
