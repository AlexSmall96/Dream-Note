import { checkSchema } from "express-validator";
import { User } from "../models/user.model.js";

// Validator for Sign up route
export const signupValidator = checkSchema({
    // Email
    email: { 
        // Valid format
        isEmail: {errorMessage: "Please provide a valid email address.", bail: true}, 
        // Email address must be unique
        custom: {
            options: async (email) => {
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    throw new Error("Email address already in use.");
                }
                return true;
            }
        }
    },
    // Password
    password: {  
        // Minimum length
        isLength: {
            options: { min: 8 },
            errorMessage: 'Password must be at least 8 characters.'
        },
        // Cannot contain 'password'
        custom: {
            options: async (password) => {
                if (password.toLowerCase().includes('password')) {
                    throw new Error('Password cannot contain "password"')
                }
                return true;
            }
        }
    },
})