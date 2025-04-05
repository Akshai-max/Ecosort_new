import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not defined');
}

if (!process.env.JWT_EXPIRES_IN) {
  throw new Error('JWT_EXPIRES_IN environment variable is not defined');
}

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

export interface JWTPayload {
  id: string;
  email: string;
  role: string;
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}

export function verifyToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export function getTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.split(' ')[1];
}

export function getTokenFromCookie(req: NextRequest): string | null {
  return req.cookies.get('token')?.value || null;
}

export async function authenticateRequest(req: NextRequest) {
  const token = getTokenFromRequest(req) || getTokenFromCookie(req);
  if (!token) {
    throw new Error('No token provided');
  }
  return verifyToken(token);
} 