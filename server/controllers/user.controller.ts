import { injectable } from "inversify";
import { UserDocument, UserInterface } from "../interfaces.js"
import { User } from "../models/user.model.js";
import { AuthenticatedRequest } from "../middleware/auth.js";

// Controller clas for User model
@injectable()
export class UserController {
    // Sign up
    public async handleSignUp(data: UserInterface){
        const user = new User(data);
        await user.save();
        return {email: user.email, id: user._id}
    }

    // Log in
    public async handleLogIn(data: UserInterface){
        const { email, password } = data;
        const user = await User.findByCredentials(email, password)
        const token = await user.generateAuthToken()
        return {user, token}
    }

    // Logout
    public async handleLogOut(req: AuthenticatedRequest){
        const { user, token } = req
        user.tokens = user.tokens.filter((oldToken: string) => oldToken !== token)
        await user.save()
    }

    // Send one time passcode (OTP) to email address
    public async handleSendOTP(email: string){
        const account = await User.findOne({email})
        return account
    }
    
    // Edit profile
    public async handleUpdateProfile(update: UserInterface, user: UserDocument){
        const { email, password } = update;
        if (email){
            user.email = email
        }
        if (password){
            user.password = password
        }
        await user.save()
        return { user }
    }

    // Delete account
    public async handleDeleteAccount(user: UserDocument){
        await user.deleteOne()
    }
}