import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const router = express.Router();

// Register new user
router.post('/register', asyncHandler(async (req: express.Request, res: express.Response) => {
  const { name, email, password, role = 'EMPLOYEE' } = req.body;

  // Validation
  if (!name || !email || !password) {
    throw createError('Name, email, and password are required', 400);
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw createError('User already exists with this email', 409);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role.toUpperCase(),
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    }
  });

  logger.info(`New user registered: ${email} with role ${role}`);

  res.status(201).json({
    success: true,
    message: 'Welcome to Knowledge Heirloom! 🎁',
    user
  });
}));

// Login
router.post('/login', asyncHandler(async (req: express.Request, res: express.Response) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    throw createError('Email and password are required', 400);
  }

  // Find user
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw createError('Invalid credentials', 401);
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw createError('Invalid credentials', 401);
  }

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() }
  });

  // Generate JWT
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw createError('JWT secret not configured', 500);
  }

  const token = jwt.sign(
    { 
      userId: user.id,
      email: user.email,
      role: user.role 
    },
    jwtSecret
  );

  logger.info(`User logged in: ${email}`);

  res.json({
    success: true,
    message: `Welcome back, ${user.name}! 👋`,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      lastLogin: user.lastLogin
    }
  });
}));

// Get current user profile
router.get('/me', asyncHandler(async (req: any, res: express.Response) => {
  // This will be populated by auth middleware
  const userId = req.user?.userId;

  if (!userId) {
    throw createError('Authentication required', 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profileImage: true,
      lastLogin: true,
      createdAt: true,
      _count: {
        select: {
          conversations: true,
          legacyMessages: true
        }
      }
    }
  });

  if (!user) {
    throw createError('User not found', 404);
  }

  res.json({
    success: true,
    user
  });
}));

// Refresh token
router.post('/refresh', asyncHandler(async (req: express.Request, res: express.Response) => {
  const { token } = req.body;

  if (!token) {
    throw createError('Token is required', 400);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw createError('JWT secret not configured', 500);
    }
    
    // Generate new token
    const newToken = jwt.sign(
      { 
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role 
      },
      jwtSecret
    );

    res.json({
      success: true,
      token: newToken
    });

  } catch (error) {
    throw createError('Invalid or expired token', 401);
  }
}));

export default router;
