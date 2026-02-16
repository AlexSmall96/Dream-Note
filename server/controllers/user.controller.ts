import { injectable, inject } from "inversify";
import { UserDocument, UserInterface } from "../interfaces/user.interfaces.js"
import { User } from "../models/user.model.js";
import { AuthenticatedRequest } from "../interfaces/auth.interfaces.js";
import { UserService } from "../services/user.service.js";
import { EmailService } from "../services/email.service.js"
import { Otp } from "../models/OTP.model.js"
import { generateOtp } from "../services/utils/otp.js";
import { OtpDocument } from "../interfaces/otp.interfaces.js";

export type purposeType = "email-update" | "password-reset"

// Controller clas for User model
@injectable()
export class UserController {

    constructor(
        @inject(UserService) private userService: UserService,
        @inject(EmailService) private emailService: EmailService
    ){}

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
        await this.userService.resetGuestData(user._id.toString())
        const token = await user.generateAuthToken(true)
        return {user, token, isGuest: true}
    }

    // Logout
    public async handleLogOut(req: AuthenticatedRequest){
        const { user, token } = req
        user.tokens = user.tokens.filter((oldToken: string) => oldToken !== token)
        await user.save()
    }

    public findUserByEmail(email: string){
        return User.findOne({email})
    }

    public findUserById(id: string){
        return User.findById(id)
    }


    
    // Sends and generates a OTP for either email update or password reset, depending on the provided purpose. 
    // UserId is only required for email update as password reset is for unauthenticated users.
    public async handleSendOTP(email: string, purpose: purposeType, incomingUserId?: string){
        const otp = generateOtp()
        let userId: string
        if (!incomingUserId){
            const user = await User.findByEmailOrThrowError(email)
            userId = user._id.toString()
        }
        else {
            userId = incomingUserId
        }
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 mins
            await Otp.create({
                userId,
                email,
                otp,
                purpose,
                expiresAt,
            })
        await this.emailService.sendMailWithData(purpose, email, otp, 10)
    }
    
    // Find saved OTP record based on userId and provied otp value
    public async handleFindOtpById(otp: string, purpose: purposeType, userId: string): Promise<OtpDocument | null>{
        const otpRecord = await Otp.findOne({
            userId, 
            otp, 
            purpose, 
            used: false, 
            expiresAt: { $gt: new Date() }
        })
        return otpRecord
    }

    public async handleFindOtpByEmailAndUpdate(otp: string, email: string, purpose: purposeType): Promise<OtpDocument | null>{
        const otpRecord = await Otp.findOneAndUpdate({
            otp,
            email, 
            purpose, 
            used: false, 
            expiresAt: { $gt: new Date() }
        }, {
            $set: {used: true}
        }, {
            new: true
        })
        return otpRecord        
    }

    public async handleFindUsedOtp(otpId: string, userId: string, purpose: purposeType): Promise<OtpDocument | null>{
        const otp = await Otp.findOne({
            _id: otpId,
            userId: userId,
            purpose,
            used: true,
            expiresAt: { $gt: new Date() }
        })
        return otp
    }

    public async handleDeleteOtp(otpId: string){
        await Otp.findOneAndDelete({_id: otpId})
    }
    
    public async handleUpdatePassword(password: string, userId: string){
        const user = await User.findByIdOrThrowError(userId)
        user.password = password
        await user.save()
    }

    public async handleUpdateEmail(email: string, userId: string){
        const user = await User.findByIdOrThrowError(userId)
        user.email = email
        await user.save()
        return user
    }

    // Delete account
    public async handleDeleteAccount(userId: string){
        await User.findOneAndDelete({ _id: userId})
    }
}