import express from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

const router = express.Router();

// Demo users - in a real app these would be in the database
const DEMO_USERS = [
  {
    id: '1',
    name: 'Junior Developer',
    email: 'junior@knowledgeheirloom.com',
    password: 'password123',
    role: 'EMPLOYEE',
    profileImage: null,
    createdAt: new Date().toISOString(),
    lastLogin: null
  },
  {
    id: '2',
    name: 'Senior Developer',
    email: 'senior@knowledgeheirloom.com',
    password: 'password123',
    role: 'SENIOR_DEV',
    profileImage: null,
    createdAt: new Date().toISOString(),
    lastLogin: null
  },
  {
    id: '3',
    name: 'System Admin',
    email: 'admin@knowledgeheirloom.com',
    password: 'password123',
    role: 'ADMIN',
    profileImage: null,
    createdAt: new Date().toISOString(),
    lastLogin: null
  }
];

// Demo login endpoint
router.post('/login', (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = DEMO_USERS.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password (in demo, just check if it matches)
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT (using a simple secret for demo)
    const jwtSecret = process.env.JWT_SECRET || 'demo_secret_key_knowledge_heirloom';
    
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role 
      },
      jwtSecret,
      { expiresIn: '7d' } // Token expires in 7 days
    );

    logger.info(`Demo user logged in: ${email}`);

    res.json({
      success: true,
      message: `Welcome back, ${user.name}! 👋`,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        lastLogin: new Date().toISOString(),
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Demo login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Demo register endpoint
router.post('/register', (req: express.Request, res: express.Response) => {
  try {
    const { name, email, password, role = 'EMPLOYEE' } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    // Check if user already exists
    const existingUser = DEMO_USERS.find(u => u.email === email);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create new demo user
    const newUser = {
      id: String(DEMO_USERS.length + 1),
      name,
      email,
      password,
      role: role.toUpperCase(),
      profileImage: null,
      createdAt: new Date().toISOString(),
      lastLogin: null
    };

    // Add to demo users array
    DEMO_USERS.push(newUser);

    logger.info(`New demo user registered: ${email} with role ${role}`);

    res.status(201).json({
      success: true,
      message: 'Welcome to Knowledge Heirloom! 🎁',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        profileImage: newUser.profileImage,
        createdAt: newUser.createdAt
      }
    });

  } catch (error) {
    console.error('Demo register error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Demo get current user
router.get('/me', (req: any, res: express.Response) => {
  try {
    // Simple token verification for demo
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET || 'demo_secret_key_knowledge_heirloom';

    try {
      const decoded = jwt.verify(token, jwtSecret) as any;
      
      // Find user by ID
      const user = DEMO_USERS.find(u => u.id === decoded.userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage,
          lastLogin: user.lastLogin || new Date().toISOString(),
          createdAt: user.createdAt,
          _count: {
            conversations: 5, // Demo count
            legacyMessages: 12 // Demo count
          }
        }
      });

    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

  } catch (error) {
    console.error('Demo me endpoint error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Demo refresh token
router.post('/refresh', (req: express.Request, res: express.Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required'
      });
    }

    const jwtSecret = process.env.JWT_SECRET || 'demo_secret_key_knowledge_heirloom';

    try {
      const decoded = jwt.verify(token, jwtSecret) as any;
      
      // Generate new token
      const newToken = jwt.sign(
        { 
          userId: decoded.userId,
          email: decoded.email,
          role: decoded.role 
        },
        jwtSecret,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        token: newToken
      });

    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

  } catch (error) {
    console.error('Demo refresh error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
