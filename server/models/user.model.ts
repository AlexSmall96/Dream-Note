import { Schema, Model, model } from "mongoose";
import { UserInterface } from "../interfaces";

const userSchema: Schema<UserInterface> = new Schema({
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

export const User:Model<UserInterface> = model('User', userSchema)