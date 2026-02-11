import { injectable } from "inversify";
import { UserDocument, UserInterface } from "../interfaces/user.interfaces.js"
import { User } from "../models/user.model.js";
import { AuthenticatedRequest } from "../interfaces/auth.interfaces.js";

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
    public async handleLogIn(user: UserDocument): Promise<{user: UserDocument, token: string, isGuest: boolean}>{
        const token = await user.generateAuthToken()
        return {user, token, isGuest: false}
    }

    // Login as guest
    public async handleGuestLogIn(): Promise<{user: UserDocument, token: string, isGuest: boolean}> {
        const guestEmail = process.env.GUEST_USER_EMAIL
        if (!guestEmail) {
            throw new Error('GUEST_USER_EMAIL is not configured')
        }
        const user = await User.findByEmailOrThrowError(guestEmail)
        const token = await user.generateAuthToken(true)
        return {user, token, isGuest: true}
    }

    // Logout
    public async handleLogOut(req: AuthenticatedRequest){
        const { user, token } = req
        user.tokens = user.tokens.filter((oldToken: string) => oldToken !== token)
        await user.save()
    }

    // Send one time passcode (OTP) to email address
    public findUserByEmail(email: string){
        return User.findOne({email})
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
    public async handleDeleteAccount(userId: string){
        await User.findOneAndDelete({ _id: userId})
    }
}