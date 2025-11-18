import  { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';

// Extend express Request interface with user and token
export interface AuthenticatedRequest extends Request {
    user?: any;
    token?: string;
}

// Extend JwtPayload with id
export interface decodedTokenWithId extends JwtPayload {
    _id: string;
}