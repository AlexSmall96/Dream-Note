import { injectable } from "inversify";
import { User } from "../../models/user.model.js";
import {generateOtp} from "../utils/otp.js"
import { Otp } from "../../models/OTP.model.js";
import {AppError} from '../../utils/appError.js'
import { OtpDocument } from "../../interfaces/otp.interfaces.js";
import bcrypt from "bcrypt";

export type purposeType = "email-update" | "password-reset" | 'email-verification'

@injectable()
export class OtpService {

    // Sends and generates a OTP for either email update or password reset, depending on the provided purpose. 
    // UserId is only required for email update as password reset is for unauthenticated users.
    public async generateOTP(email: string, purpose: purposeType, incomingUserId?: string, expiresIn: number = 10 * 60 * 1000){
        if (purpose !== 'password-reset' && !incomingUserId){
            // Throw system error - this situation will never be reached from data inputted via client
            // Only included for debugging purposes in the case that account.controller calls this service incorrectly
            throw new AppError('Arugment incomingUserId must be provided if purpose is email-update or email verification.', 500)
        }
        const existingUser = await User.findOne({ email })

        if (purpose === "email-update" && existingUser) {
            const errorMessage = existingUser._id.toString() !== incomingUserId ? 
                'Email address already in use.' 
            : 
                'This email address is already associated with your account.'
            throw new AppError(errorMessage, 400, 'email');
        }

        if (purpose === "password-reset" && !existingUser) {
            // Don't throw error if no user found for password reset to prevent email enumeration
            return null
        }

        const otp = generateOtp()
        // If purpose is password reset, existingUser must exist at this point due to early return
        // If purpose is email-update, incomingUserId must exist at this point due to throw error
        const userId = purpose === "password-reset" ? existingUser!._id.toString() : incomingUserId
        const expiresAt = new Date(Date.now() + expiresIn) 
            await Otp.create({
                userId,
                email,
                otp,
                purpose,
                expiresAt,
            })
        return otp
    }

    public async findOtp(otp:string, purpose: purposeType, options: {email?: string, userId?: string} ) {
        // Included for debugging purposes, userId or email should always be provided
        if (!options.email && !options.userId) {
            throw new AppError("Either email or userId must be provided", 500);
        }
        const criteria = {
            ...options, 
            purpose, 
            used: false,
            expiresAt: { $gt: new Date() }
        }
        const otpRecord = await Otp.findOne(criteria) 
        
        if (!otpRecord){
            return null
        }

        const isMatch = await bcrypt.compare(otp, otpRecord.otp)

        if (!isMatch) {
            return null
        }

        return otpRecord
    }

    public async findOtpByEmailAndUpdate(otp: string, email: string, purpose: purposeType): Promise<OtpDocument | null>{   
        const otpRecord = await this.findOtp(otp, purpose, {email})
        if (!otpRecord){
            return null
        }
        otpRecord.used = true
        await otpRecord.save()
        return otpRecord
    }

    public async findUsedOtp(otpId: string, userId: string, purpose: purposeType): Promise<OtpDocument | null>{
        const otp = await Otp.findOne({
            _id: otpId,
            userId: userId,
            purpose,
            used: true,
            expiresAt: { $gt: new Date() }
        })
        return otp
    }
    
    public async deleteOtp(otpId: string){
        await Otp.findByIdAndDelete(otpId)
    }

}