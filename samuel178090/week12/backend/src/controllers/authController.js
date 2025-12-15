/**
 * Auth Controller - Samuel Ajewole
 * Software Engineering Week 12 Challenge
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

// Mock users database (in production, use MongoDB)
const users = [
  {
    id: 1,
    username: 'samuel',
    email: 'josephsammy1994@gmail.com',
    password: '$2a$10$8K1p/a0dRcK2P1cypcMOTOatyTcMhqLux7WgAOHDk8HpxObm4H8AW', // password123
    role: 'admin',
    createdAt: new Date('2024-01-01')
  },
  {
    id: 2,
    username: 'demo',
    email: 'demo@wavecom.com',
    password: '$2a$10$8K1p/a0dRcK2P1cypcMOTOatyTcMhqLux7WgAOHDk8HpxObm4H8AW', // password123
    role: 'user',
    createdAt: new Date('2024-01-01')
  },
  {
    id: 3,
    username: 'client1',
    email: 'client1@example.com',
    password: '$2a$10$8K1p/a0dRcK2P1cypcMOTOatyTcMhqLux7WgAOHDk8HpxObm4H8AW', // password123
    role: 'client',
    createdAt: new Date('2024-01-01')
  }
];

class AuthController {
  // User login
  async login(req, res) {
    try {
      const { username, password } = req.body;
      
      // Find user by username or email
      const user = users.find(u => 
        u.username === username || u.email === username
      );
      
      if (!user) {
        logger.warn('Login attempt with invalid username:', username);
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials',
          message: 'Username or password is incorrect'
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        logger.warn('Login attempt with invalid password for user:', username);
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials',
          message: 'Username or password is incorrect'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          username: user.username, 
          email: user.email,
          role: user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      // Return success response
      res.json({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
          }
        },
        message: 'Login successful'
      });

      logger.info('User logged in successfully:', {
        userId: user.id,
        username: user.username,
        role: user.role
      });

    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Login failed',
        message: 'An error occurred during login'
      });
    }
  }

  // User registration
  async register(req, res) {
    try {
      const { username, email, password, role = 'user' } = req.body;
      
      // Check if user already exists
      const existingUser = users.find(u => 
        u.username === username || u.email === email
      );
      
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: 'User already exists',
          message: 'Username or email is already taken'
        });
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      // Create new user
      const newUser = {
        id: users.length + 1,
        username,
        email,
        password: hashedPassword,
        role: ['admin', 'user', 'client'].includes(role) ? role : 'user',
        createdAt: new Date()
      };
      
      users.push(newUser);

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: newUser.id, 
          username: newUser.username, 
          email: newUser.email,
          role: newUser.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      res.status(201).json({
        success: true,
        data: {
          token,
          user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role
          }
        },
        message: 'Registration successful'
      });

      logger.info('New user registered:', {
        userId: newUser.id,
        username: newUser.username,
        role: newUser.role
      });

    } catch (error) {
      logger.error('Registration error:', error);
      res.status(500).json({
        success: false,
        error: 'Registration failed',
        message: 'An error occurred during registration'
      });
    }
  }

  // Verify JWT token
  async verifyToken(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({
          success: false,
          error: 'No token provided',
          message: 'Authorization token is required'
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = users.find(u => u.id === decoded.userId);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid token',
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
          },
          tokenValid: true
        },
        message: 'Token is valid'
      });

    } catch (error) {
      logger.error('Token verification error:', error);
      res.status(401).json({
        success: false,
        error: 'Invalid token',
        message: 'Token verification failed'
      });
    }
  }

  // Get current user profile
  async getProfile(req, res) {
    try {
      const user = users.find(u => u.id === req.user.userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
          }
        }
      });

    } catch (error) {
      logger.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get user profile',
        message: error.message
      });
    }
  }

  // Logout (client-side token removal)
  async logout(req, res) {
    try {
      // In a real application, you might want to blacklist the token
      res.json({
        success: true,
        message: 'Logout successful'
      });

      logger.info('User logged out:', {
        userId: req.user?.userId,
        username: req.user?.username
      });

    } catch (error) {
      logger.error('Logout error:', error);
      res.status(500).json({
        success: false,
        error: 'Logout failed',
        message: error.message
      });
    }
  }

  // Get all users (admin only)
  async getAllUsers(req, res) {
    try {
      const usersData = users.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }));

      res.json({
        success: true,
        data: {
          users: usersData,
          count: usersData.length
        }
      });

    } catch (error) {
      logger.error('Get all users error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get users',
        message: error.message
      });
    }
  }
}

module.exports = new AuthController();