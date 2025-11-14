import { Schema, Model, model, Document } from "mongoose";
import { UserInterface } from "../interfaces.js";
import bcrypt from "bcrypt";

// Create new interface from UserInterface + mongoose Document
export interface UserDocument extends UserInterface, Document {}

const userSchema: Schema<UserDocument> = new Schema({
    email: {
        type: String,
        required: [true, 'Email address is required'],
        maxlength: [50, 'Email address cannot be more than 50 characters.'],
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        maxlength: [50, 'Password cannot be more than 50 characters.'],
        trim: true        
    }
}, {timestamps: true})

// Method to hash passwords when user is created or password is changed
userSchema.pre<UserDocument>("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});


export const User:Model<UserDocument> = model('User', userSchema)