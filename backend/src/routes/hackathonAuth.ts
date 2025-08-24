// HACKATHON WINNER - BULLETPROOF AUTH SYSTEM
import express from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

const router = express.Router();

// DEMO USERS - GUARANTEED TO WORK
const DEMO_USERS = [
  {
    id: '1',
    name: 'Junior Developer',
    email: 'junior@knowledgeheirloom.com',
    password: 'password123',
    role: 'EMPLOYEE'
  },
  {
    id: '2', 
    name: 'Senior Developer',
    email: 'senior@knowledgeheirloom.com',
    password: 'password123',
    role: 'SENIOR_DEV'
  },
  {
    id: '3',
    name: 'System Admin',
    email: 'admin@knowledgeheirloom.com', 
    password: 'password123',
    role: 'ADMIN'
  },
  {
    id: '4',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test',
    role: 'EMPLOYEE'
  }
];

// BULLETPROOF LOGIN - WILL ALWAYS WORK
router.post('/login', (req, res) => {
  try {
    console.log('🎯 HACKATHON LOGIN ATTEMPT:', req.body);
    
    const { email, password } = req.body;

    // Find user - CASE INSENSITIVE
    const user = DEMO_USERS.find(u => 
      u.email.toLowerCase() === (email || '').toLowerCase()
    );

    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password - FLEXIBLE
    if (user.password !== password) {
      console.log('❌ Wrong password for:', email);
      return res.status(401).json({
        success: false, 
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET || 'hackathon_winner_secret_2025',
      { expiresIn: '24h' }
    );

    console.log('✅ HACKATHON LOGIN SUCCESS:', user.email);

    res.json({
      success: true,
      message: `🎉 Welcome ${user.name}! Ready to win this hackathon!`,
      token,
      user: {
        id: user.id,
        name: user.name, 
        email: user.email,
        role: user.role,
        lastLogin: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('💥 LOGIN ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// BACKUP REGISTER ENDPOINT
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  
  // For hackathon - just add to demo users
  const newUser = {
    id: String(DEMO_USERS.length + 1),
    name: name || 'New User',
    email: email || 'new@user.com', 
    password: password || 'password123',
    role: 'EMPLOYEE'
  };

  DEMO_USERS.push(newUser);

  res.json({
    success: true,
    message: '🎉 Registration successful!',
    user: newUser
  });
});

// HEALTH CHECK FOR THIS ROUTE
router.get('/test', (req, res) => {
  res.json({
    message: '🚀 HACKATHON AUTH SYSTEM ONLINE!',
    users: DEMO_USERS.map(u => ({ email: u.email, role: u.role }))
  });
});

// GET CURRENT USER ENDPOINT
router.get('/me', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET || 'hackathon_winner_secret_2025';

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
          lastLogin: new Date().toISOString(),
          createdAt: '2025-01-01T00:00:00.000Z'
        }
      });

    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

  } catch (error) {
    console.error('Hackathon me endpoint error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
