import { Schema, model } from "mongoose";
import {  UserDocument, UserModel} from "../interfaces/user.interfaces.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const userSchema = new Schema<UserDocument, UserModel>({
    email: {
        type: String,
        required: [true, 'Email address is required'],
        maxlength: [50, 'Email address cannot be more than 50 characters.'],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        trim: true        
    },
    tokens: {
        type: [String],
        tokens: [{
  token: String
}]
    }
}, {timestamps: true})

// Method to hash passwords when user is created or password is changed
userSchema.pre<UserDocument>("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

// Static method to find user by email and password
userSchema.statics.findByCredentials = async function (
    this: UserModel,
    email:string, 
    password:string
) : Promise<UserDocument> {
    const user = await this.findOne({email})
    if (!user) {
        throw new Error('No account found associated with provided email address.')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Incorrect password.')
    }
    return user
}

userSchema.statics.findByIdOrThrowError = async function (this: UserModel, _id: string) : Promise<UserDocument> {
    const user = await this.findById(_id)
    if (!user) {
        throw new Error('Invalid id.')
    }
    return user
}

// Filters the user data to hide private data from response
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    delete user.tokens;
    delete user.__v;
    return user;
};

// Method to generate JSON web token
userSchema.methods.generateAuthToken = async function (this: UserDocument): Promise<string> {
    const secretKey =  process.env.JWT_SECRET
    const user = this
    if (!secretKey){
        throw new Error('Please provide a json web token secret key.')
    }
    const token = jwt.sign({ _id:user._id.toString() }, secretKey, { expiresIn: "1h" })
    user.tokens.push(token)
    await user.save()
    return token
}

export const User = model<UserDocument, UserModel>("User", userSchema);