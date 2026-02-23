import  { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';
import { UserDocument, UserInterface } from './user.interfaces';


// Extend express Request interface with user
export interface RequestWithUser extends Request {
    user?: any;
}

export interface IncomingAuthRequest extends RequestWithUser {
    token?: string;
    isGuest?: boolean;    
}


// Extend express Request interface with user and token
export interface AuthenticatedRequest extends Request {
    user: UserDocument;
    token: string;
    isGuest?: boolean;
}

// Extend JwtPayload with id
export interface decodedTokenWithId extends JwtPayload {
    _id: string;
}