import { Model, Document, Types } from "mongoose";
import { UserDocument } from "./user.interfaces.js";

export interface OtpInterface {
    email: string,
    otp: string,
    purpose: "update-email" | "reset-password" | "email-verification",
    expiresAt: Date,
    used: boolean
    userId: UserDocument['_id']
}

export interface OtpDocument extends OtpInterface, Document {
    _id: Types.ObjectId;
}