import  { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';


// Extend express Request interface with user
export interface RequestWithUser extends Request {
    user?: any;
}

// Extend express Request interface with user and token
export interface AuthenticatedRequest extends RequestWithUser {
    token?: string;
    isGuest?: boolean;
}

// Extend JwtPayload with id
export interface decodedTokenWithId extends JwtPayload {
    _id: string;
}