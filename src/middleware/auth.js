/**
 * Authentication Middleware - JWT token validation
 */

import { error as errorResponse } from 'itty-router-extras';

export async function authenticateToken(request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return errorResponse(401, 'Access token required');
  }

  try {
    const decoded = await verifyToken(token, request.env.JWT_SECRET);
    request.user = decoded;
    request.authenticated = true;
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return errorResponse(401, 'Invalid or expired token');
  }
}

export async function verifyToken(token, secret) {
  // Use crypto API for JWT verification
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid token format');

  const [headerB64, payloadB64, signatureB64] = parts;
  
  // Decode payload
  const payload = JSON.parse(
    new TextDecoder().decode(
      Uint8Array.from(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0))
    )
  );

  // Check expiration
  if (payload.exp && payload.exp * 1000 < Date.now()) {
    throw new Error('Token expired');
  }

  // For production, implement proper HMAC-SHA256 verification
  // This is a simplified version - use a JWT library in production
  return payload;
}

export function generateToken(payload, secret, expiresIn = 3600) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const exp = now + expiresIn;

  const tokenPayload = {
    ...payload,
    iat: now,
    exp: exp,
  };

  // Simplified token generation - use proper JWT library in production
  const headerB64 = btoa(JSON.stringify(header));
  const payloadB64 = btoa(JSON.stringify(tokenPayload));
  
  return `${headerB64}.${payloadB64}.signature`;
}
