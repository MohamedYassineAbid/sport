import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    sub: string;
    preferred_username: string;
    email: string;
    realm_access?: {
      roles: string[];
    };
  };
}

/**
 * Middleware to verify Keycloak JWT token
 * Note: In production, you should verify the token signature with Keycloak's public key
 */
export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "No token provided" });
      return;
    }

    const token = authHeader.substring(7);

    // Decode token (in production, verify signature with Keycloak public key)
    const decoded = jwt.decode(token) as any;

    if (!decoded) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }

    // Check token expiration
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      res.status(401).json({ error: "Token expired" });
      return;
    }

    req.user = {
      sub: decoded.sub,
      preferred_username: decoded.preferred_username,
      email: decoded.email,
      realm_access: decoded.realm_access,
    };

    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ error: "Authentication failed" });
  }
}

/**
 * Middleware to check if user has a specific role
 */
export function requireRole(role: string) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const roles = req.user.realm_access?.roles || [];
    if (!roles.includes(role)) {
      res.status(403).json({ error: `Requires ${role} role` });
      return;
    }

    next();
  };
}
