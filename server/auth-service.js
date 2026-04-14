import crypto from 'crypto';
import db from './database.js';

// In production, use bcrypt: import bcrypt from 'bcrypt';
// For now, we'll use a simple hash function (NOT for production)
function hashPassword(password) {
  return crypto.createHash('sha256').update(password + process.env.PASSWORD_SALT || 'default-salt').digest('hex');
}

function verifyPassword(password, hash) {
  return hashPassword(password) === hash;
}

// Generate a secure random token
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Store login attempts for rate limiting
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const ATTEMPT_WINDOW = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(username) {
  const now = Date.now();
  const attempts = loginAttempts.get(username) || [];
  
  // Remove old attempts outside the window
  const recentAttempts = attempts.filter(time => now - time < ATTEMPT_WINDOW);
  
  if (recentAttempts.length >= MAX_ATTEMPTS) {
    return false; // Rate limited
  }
  
  recentAttempts.push(now);
  loginAttempts.set(username, recentAttempts);
  return true;
}

function resetRateLimit(username) {
  loginAttempts.delete(username);
}

// Initialize admin user if not exists
function initializeAdminUser() {
  try {
    const admin = db.prepare('SELECT id FROM users WHERE username = ?').get('admin');
    if (!admin) {
      const hashedPassword = hashPassword('trq2026');
      db.prepare(`
        INSERT INTO users (username, email, password)
        VALUES (?, ?, ?)
      `).run('admin', 'admin@trq.design', hashedPassword);
      console.log('✓ Admin user initialized');
    }
  } catch (error) {
    console.error('Error initializing admin user:', error.message);
  }
}

// Authenticate user
function authenticateUser(username, password) {
  try {
    if (!checkRateLimit(username)) {
      return { success: false, error: 'Too many login attempts. Please try again later.' };
    }

    const user = db.prepare('SELECT id, username, email, password FROM users WHERE username = ?').get(username);
    
    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }

    if (!verifyPassword(password, user.password)) {
      return { success: false, error: 'Invalid credentials' };
    }

    resetRateLimit(username);
    
    // Log successful login
    db.prepare(`
      INSERT INTO audit_logs (user_id, action, details, ip_address)
      VALUES (?, ?, ?, ?)
    `).run(user.id, 'LOGIN_SUCCESS', 'User logged in successfully', '');

    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    };
  } catch (error) {
    console.error('Authentication error:', error.message);
    return { success: false, error: 'Authentication failed' };
  }
}

// Create audit log
function logAuditEvent(userId, action, details, ipAddress = '') {
  try {
    db.prepare(`
      INSERT INTO audit_logs (user_id, action, details, ip_address, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(userId, action, details, ipAddress, new Date().toISOString());
  } catch (error) {
    console.error('Error logging audit event:', error.message);
  }
}

// Get audit logs
function getAuditLogs(limit = 100) {
  try {
    return db.prepare(`
      SELECT al.*, u.username
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ORDER BY al.created_at DESC
      LIMIT ?
    `).all(limit);
  } catch (error) {
    console.error('Error fetching audit logs:', error.message);
    return [];
  }
}

export {
  hashPassword,
  verifyPassword,
  generateToken,
  checkRateLimit,
  resetRateLimit,
  initializeAdminUser,
  authenticateUser,
  logAuditEvent,
  getAuditLogs
};
