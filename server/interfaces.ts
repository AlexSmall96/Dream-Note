import { Model, Document, Types } from "mongoose";

// Define basic User Interface
export interface UserInterface {
    email: string;
    password: string;
}

// New interface to define methods
export interface UserMethods {
    generateAuthToken(): Promise<string>;
}

// Create new interface from UserInterface + mongoose Document
export interface UserDocument extends UserInterface, UserMethods, Document {
    _id: Types.ObjectId;
}

// Create a Mongoose model to define static methods
export interface UserModel extends Model<UserDocument> {
    findByCredentials(
        email: string,
        password: string
    ): Promise<UserDocument>;
}

