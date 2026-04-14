/**
 * Authentication Service for Cloudflare Functions
 * Implements JWT, rate limiting, and session management
 */

// Simple in-memory rate limiting (in production, use Durable Objects or KV)
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const ATTEMPT_WINDOW = 15 * 60 * 1000; // 15 minutes

// Session storage (in production, use Durable Objects or KV)
const sessions = new Map();

function checkRateLimit(username) {
  const now = Date.now();
  const attempts = loginAttempts.get(username) || [];
  
  // Remove old attempts outside the window
  const recentAttempts = attempts.filter(time => now - time < ATTEMPT_WINDOW);
  
  if (recentAttempts.length >= MAX_ATTEMPTS) {
    return false;
  }
  
  recentAttempts.push(now);
  loginAttempts.set(username, recentAttempts);
  return true;
}

function resetRateLimit(username) {
  loginAttempts.delete(username);
}

// Simple JWT creation (in production, use proper JWT library with RS256)
function createJWT(payload, secret, expiresIn = 900) { // 15 minutes
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const now = Math.floor(Date.now() / 1000);
  const claims = {
    ...payload,
    iat: now,
    exp: now + expiresIn
  };

  const headerEncoded = btoa(JSON.stringify(header));
  const claimsEncoded = btoa(JSON.stringify(claims));
  
  // Create signature
  const message = `${headerEncoded}.${claimsEncoded}`;
  const signature = btoa(
    String.fromCharCode.apply(null, new TextEncoder().encode(message + secret))
  );

  return `${message}.${signature}`;
}

function verifyJWT(token, secret) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerEncoded, claimsEncoded, signatureEncoded] = parts;
    
    // Verify signature
    const message = `${headerEncoded}.${claimsEncoded}`;
    const expectedSignature = btoa(
      String.fromCharCode.apply(null, new TextEncoder().encode(message + secret))
    );

    if (signatureEncoded !== expectedSignature) {
      return null;
    }

    // Decode and verify claims
    const claims = JSON.parse(atob(claimsEncoded));
    const now = Math.floor(Date.now() / 1000);

    if (claims.exp < now) {
      return null; // Token expired
    }

    return claims;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}

function createRefreshToken() {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function storeSession(userId, token, refreshToken, expiresAt, refreshExpiresAt, ipAddress, userAgent) {
  const sessionId = `session_${userId}_${Date.now()}`;
  sessions.set(sessionId, {
    userId,
    token,
    refreshToken,
    expiresAt,
    refreshExpiresAt,
    ipAddress,
    userAgent,
    createdAt: Date.now()
  });
  return sessionId;
}

function getSession(token) {
  for (const [, session] of sessions) {
    if (session.token === token && session.expiresAt > Date.now()) {
      return session;
    }
  }
  return null;
}

function revokeSession(token) {
  for (const [key, session] of sessions) {
    if (session.token === token) {
      sessions.delete(key);
      return true;
    }
  }
  return false;
}

function cleanupExpiredSessions() {
  const now = Date.now();
  for (const [key, session] of sessions) {
    if (session.expiresAt < now) {
      sessions.delete(key);
    }
  }
}

export {
  checkRateLimit,
  resetRateLimit,
  createJWT,
  verifyJWT,
  createRefreshToken,
  storeSession,
  getSession,
  revokeSession,
  cleanupExpiredSessions
};
