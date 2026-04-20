import { injectable, inject} from "inversify";
import { Dream } from "../../models/dream.model.js";
import { Theme } from "../../models/theme.model.js";
import { User } from "../../models/user.model.js";
import { UserInterface, UserDocument } from "../../interfaces/user.interfaces.js";
import { guestData } from '../../seed-data/dreams.js'
import { AccountService } from "./account.service.js";
import { OtpService } from "./otp.service.js";
import { ResetTokenService } from "./reset-token.service.js";
import { AppError } from "../../utils/appError.js";
import { EmailService } from "./email.service.js";

@injectable()
export class AuthService {

    constructor(
        @inject(AccountService) private accountService: AccountService,
        @inject(OtpService) private otpService: OtpService,
        @inject(ResetTokenService) private resetTokenService: ResetTokenService,
        @inject(EmailService) private emailService: EmailService,
    ){}

    // Sign up
    public async signUp(data: UserInterface){
        const user = new User(data);
        await user.save();
        await this.accountService.requestEmailVerification(data.email, user._id.toString(), true)
        return {user, message: 'Signup succesful. Please check your emails for verification instructions.'}
    }

    // Login
    public async login(user: UserDocument){
        const token = await user.generateAuthToken()
        return {user, token, isGuest: false}
    }

    // Logout
    public async logout(user: UserDocument, token: string){
        user.tokens = user.tokens.filter((oldToken: string) => oldToken !== token)
        await user.save()
    }

    public async requestPasswordReset(email: string){
        const otp = await this.otpService.generateOTP(email, 'password-reset')
        if (otp){
            await this.emailService.sendMailWithData('password-reset', email, otp, 10)
        }
    }

    public async verifyResetToken(resetToken: string){
        const payload = this.resetTokenService.verifyPasswordResetToken(resetToken)
        const { userId, otpId } = payload
        const user = await User.findById(userId)
        if (!user) {
            throw new AppError('Invalid reset session.', 400, 'resetToken')
        }
        // Find otp
        const otp = await this.otpService.findUsedOtp(otpId, userId, 'password-reset')
        if (!otp){
            throw new AppError('Invalid reset session.', 400, 'resetToken')
        }
        return {otpId, userId}
    }



    public async resetPassword(resetToken: string, newPassword: string){
        const {otpId, userId} = await this.verifyResetToken(resetToken)
        // Delete otp as password update is successful
        await this.accountService.updatePassword(newPassword, userId)
        await this.otpService.deleteOtp(otpId)
    }

    public async verifyResetOtpAndSendToken(otp: string, email: string){
        // Find otp and mark as used - dont delete yet as needed to verify reset token
        const otpRecord = await this.otpService.findOtpByEmailAndUpdate(otp, email, 'password-reset')
        if (!otpRecord){
            throw new AppError('Invalid or expired OTP.', 400, 'otp')
        }
        const resetToken = this.resetTokenService.generatePasswordResetToken(otpRecord.userId.toString(), otpRecord._id.toString())
        return resetToken
    }

    // Save dreams and themes when guest logs in
    public async seedGuestData(guestId: string){
        await Promise.all(guestData.map(async (data) => {
            const dreamData = data.dream
            const themes = data.themes
            const savedDream = await new Dream({...dreamData, owner: guestId}).save()
            await Promise.all(themes.map(async (theme) => {
                await new Theme({theme, dream: savedDream._id, owner: guestId}).save()
            }))
        }))
    }

    // Delete guest data and seed original data
    public async resetGuestData(guestId: string) {
        // Delete guest's dreams and themes
        // Clear tokens
        await Dream.deleteMany({ owner: guestId });
        await Theme.deleteMany({ owner: guestId });
        await User.updateOne(
            { _id: guestId },
            { $set: { tokens: [] } }
        )
        await this.seedGuestData(guestId)
    }

    public async loginGuest(){
        const guestEmail = process.env.GUEST_USER_EMAIL
        if (!guestEmail) {
            throw new Error('GUEST_USER_EMAIL is not configured')
        }    
        const user = await User.findByEmailOrThrowError(guestEmail)
        await this.resetGuestData(user._id.toString())
        const token = await user.generateAuthToken(true)
        return {user, token, isGuest: true}
    }
}