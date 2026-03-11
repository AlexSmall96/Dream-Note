import { injectable, inject } from "inversify";
import { User } from "../../models/user.model.js";
import { OtpService } from './otp.service.js';
import { AppError } from "../../utils/appError.js";
import { EmailService } from './email.service.js';

@injectable()
export class AccountService {
    constructor(
        @inject(OtpService) private otpService: OtpService,
        @inject(EmailService) private emailService: EmailService,
    ){}

    public async updateEmail(email: string, userId: string){
        const user = await User.findByIdOrThrowError(userId)
        user.email = email
        await user.save()
        return user
    }

    public async verifyUser(userId: string){
        const user = await User.findByIdOrThrowError(userId)
        user.isVerified = true
        await user.save()
        return user        
    }

    public async requestEmailUpdate(email: string, userId: string){
        const otp = await this.otpService.generateOTP(email, 'email-update', userId)
        if (otp){
            await this.emailService.sendMailWithData('email-update', email, otp, 10)
        }
    }

    public async requestEmailVerification(email: string, userId: string, onSignup: boolean = false){
        const user = await User.findByIdOrThrowError(userId)
        if (user.isVerified){
            throw new AppError('Email address is already verified.', 400, 'email')
        }
        const ONE_DAY = 24 * 60 * 60 * 1000
        const otp = await this.otpService.generateOTP(email, 'email-verification', userId, ONE_DAY)
        if (otp){
            await this.emailService.sendMailWithData('email-verification', email, otp, 24, 'hours', onSignup)
        }
    }

    public async updatePassword(password: string, userId: string){
        const user = await User.findByIdOrThrowError(userId)
        user.password = password
        await user.save()
    }
   
    public async deleteAccount(userId: string){
        const user = await User.findByIdOrThrowError(userId)
        const email = user.email
        await User.findOneAndDelete({ _id: userId})
        await this.emailService.sendAccountDeletionConfirmation(email)
        return { message: 'Account deleted successfully.' }
    }

    public async updateEmailAndDeleteOtp(otp: string, userId: string){
        const otpRecord = await this.otpService.findOtp(otp, 'email-update', {userId})
        if (!otpRecord){
            throw new AppError('Invalid or expired OTP.', 400, 'otp')
        }
        await this.updateEmail(otpRecord.email, userId)
        // Otp no longer required if email is updated
        await this.otpService.deleteOtp(otpRecord._id.toString())
    }

    public async verifyEmailAndDeleteOtp(otp: string, userId: string){
        const user = await User.findByIdOrThrowError(userId)
        if (user.isVerified){
            throw new AppError('Email address is already verified.', 400, 'email')
        }
        const otpRecord = await this.otpService.findOtp(otp, 'email-verification', {userId})
        if (!otpRecord){
            throw new AppError('Invalid or expired OTP.', 400, 'otp')
        }
        await this.verifyUser(userId)
        // Otp no longer required if email is updated
        await this.otpService.deleteOtp(otpRecord._id.toString())
    }

}