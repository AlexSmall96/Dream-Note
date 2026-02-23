import mongoose, { Schema, model } from "mongoose";
import { UserDocument, UserModel} from "../interfaces/user.interfaces.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { Dream } from "./dream.model.js";
import { Theme } from "./theme.model.js";

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

// Virtual field for Dream logged by User
userSchema.virtual('dreams', {
    ref: 'Dream',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.virtual('themes', {
    ref: 'Theme',
    localField: '_id',
    foreignField: 'owner'
})

// Method to hash passwords when user is created or password is changed
userSchema.pre<UserDocument>("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

// Method to delete a users dreams and themes when account is deleted
userSchema.pre('findOneAndDelete', async function (next) {
    // Get user id
    const owner = this.getFilter()._id;
    // Find dream ids
    const dreamIds = await Dream.find({ owner }).distinct('_id');
    // If dreams are found, first delete assocaited themes
    if (dreamIds.length > 0){
        await Theme.deleteMany({ dream: { $in: dreamIds } });
    }
    // Delete dreams
    await Dream.deleteMany({owner})
    next();
})

userSchema.statics.findByIdOrThrowError = async function (this: UserModel, _id: string) : Promise<UserDocument> {
    const user = await this.findById(_id)
    if (!user) {
        throw new Error('Invalid id.')
    }
    return user
}

userSchema.statics.findByEmailOrThrowError = async function (this: UserModel, email: string) : Promise<UserDocument> {
    const user = await this.findOne({email})
    if (!user) {
        throw new Error('Invalid email.')
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
userSchema.methods.generateAuthToken = async function (this: UserDocument, isGuest: boolean = false): Promise<string> {
    const secretKey =  process.env.JWT_SECRET
    const user = this
    if (!secretKey){
        throw new Error('Please provide a json web token secret key.')
    }
    const token = jwt.sign({ _id:user._id.toString(), isGuest }, secretKey, { expiresIn: isGuest? '30m' : "24h" })
    user.tokens.push(token)
    await user.save()
    return token
}

export const User = (mongoose.models.User as UserModel) || model<UserDocument, UserModel>("User", userSchema);

