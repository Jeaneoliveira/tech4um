import "express";
 
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}
 
export interface AuthenticatedUser {
  id: number;
  username: string;
  email: string;
}
 