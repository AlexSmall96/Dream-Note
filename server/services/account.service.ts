import { injectable, inject } from "inversify";
import { User } from "../models/user.model.js";
import { OtpService } from "./otp.service.js";
import { AppError } from "../utils/appError.js";
import { ResetTokenService } from "./reset-token.service.js";
import { EmailService } from "./email.service.js";

export type purposeType = "email-update" | "password-reset"

/**
 * Functions called by account.controller: (-> = calls)
 * 1. updateEmailAndDeleteOtp -> updateEmail, otpService
 * 2. requestEmailUpdate -> otpService
 * 3. resetPassword -> updatePassword, otpService, resetTokenService
 * 4. verifyResetOtpAndSendToken -> otpService, resetTokenService
 * 
 * Functions called within the service
 * 1. updateEmail
 * 2. findUserById
 * 3. updatePassword
 */

@injectable()
export class AccountService {
    constructor(
        @inject(OtpService) private otpService: OtpService,
        @inject(ResetTokenService) private resetTokenService: ResetTokenService,
        @inject(EmailService) private emailService: EmailService,

    ){}

    public async findUserById(userId: string){
        const user = await User.findById(userId)
        return user
    }
    
    public async updateEmail(email: string, userId: string){
        const user = await User.findByIdOrThrowError(userId)
        user.email = email
        await user.save()
        return user
    }

    public async requestEmailUpdate(email: string, userId: string){
        const otp = await this.otpService.generateOTP(email, 'email-update', userId)
        if (otp){
            await this.emailService.sendMailWithData('email-update', email, otp, 10)
        }
    }

    public async requestPasswordReset(email: string){
        const otp = await this.otpService.generateOTP(email, 'password-reset')
        if (otp){
            await this.emailService.sendMailWithData('password-reset', email, otp, 10)
        }
    }

    public async updatePassword(password: string, userId: string){
        const user = await User.findByIdOrThrowError(userId)
        user.password = password
        await user.save()
    }
   
    public async deleteAccount(userId: string){
        await User.findOneAndDelete({ _id: userId})
    }

    public async updateEmailAndDeleteOtp(otp: string, userId: string){
        const otpRecord = await this.otpService.findOtpById(otp, 'email-update', userId)
        if (!otpRecord){
            throw new AppError('Invalid or expired OTP.', 400, 'otp')
        }
        await this.updateEmail(otpRecord.email, userId)
        // Otp no longer required if email is updated
        await this.otpService.deleteOtp(otpRecord._id.toString())
    }

    public async resetPassword(resetToken: string, newPassword: string){
        const payload = this.resetTokenService.verifyPasswordResetToken(resetToken)
        const { userId, otpId } = payload
        const user = await this.findUserById(userId)
        if (!user) {
            throw new AppError('Invalid reset session.', 400, 'resetToken')
        }
        // Find otp
        const otp = await this.otpService.findUsedOtp(otpId, userId, 'password-reset')
        if (!otp){
            throw new AppError('Invalid reset session.', 400, 'resetToken')
        }
        // Delete otp as password update is successful
        await this.updatePassword(newPassword, userId)
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
}